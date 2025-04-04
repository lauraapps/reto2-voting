provider "aws" {
   region = "us-east-1"
}

# Instancia EC2 con CloudWatch Agent
resource "aws_instance" "microservicio_voting" {
  ami           = "ami-0c02fb55956c7d316"  # Amazon Linux 2 (x86)
  instance_type = "t2.micro"
  key_name      = "mi-clave-aws"
  security_groups = [aws_security_group.voting_sg.name]

  # Aquí asignamos el rol IAM que ya existe
  iam_instance_profile = "EC2CloudWatchLogsRole"

  user_data = <<-EOF
  #!/bin/bash
  set -ex  # Habilita debug para ver errores en `/var/log/cloud-init-output.log`

  # Actualizar sistema
  sudo yum update -y

  # Instalar Node.js, Git y CloudWatch Agent
  curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
  sudo yum install -y nodejs git amazon-cloudwatch-agent -y
  sudo npm install -g pm2

  # Configurar PM2 para que se ejecute bajo ec2-user
  sudo su - ec2-user << 'EOF2'
    # Verificar instalación correcta
    node -v
    npm -v
    pm2 -v

    # Clonar el repositorio si no existe
    cd /home/ec2-user
    git clone https://github.com/lauraapps/reto2-voting

    cd reto2
    npm install

    # Crear la carpeta .pm2 si no existe y darle permisos
    mkdir -p /home/ec2-user/.pm2
    chmod -R 777 /home/ec2-user/.pm2

    # Iniciar la aplicación con PM2
    pm2 start server.js --name "server"
    pm2 save
    pm2 list

    # Configurar PM2 para que arranque con la instancia
    pm2 startup systemd -u ec2-user --hp /home/ec2-user
  EOF2

  # Configurar CloudWatch Agent
  sudo tee /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json > /dev/null <<EOT
  {
    "logs": {
      "logs_collected": {
        "files": {
          "collect_list": [
            {
              "file_path": "/home/ec2-user/.pm2/logs/server-out.log",
              "log_group_name": "EC2-Logs",
              "log_stream_name": "{instance_id}/pm2-out",
              "timezone": "UTC"
            },
            {
              "file_path": "/home/ec2-user/.pm2/logs/server-error.log",
              "log_group_name": "EC2-Logs",
              "log_stream_name": "{instance_id}/pm2-error",
              "timezone": "UTC"
            }
          ]
        }
      }
    }
  }
  EOT

  # Iniciar y habilitar CloudWatch Agent
  sudo systemctl enable amazon-cloudwatch-agent
  sudo systemctl start amazon-cloudwatch-agent
EOF

  tags = {
    Name = "Voting_MicroService"
  }
}

# Definir el grupo de seguridad para la EC2
resource "aws_security_group" "voting_sg" {
  name        = "voting_sg"
  description = "Habilitar puertos para Node.js"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # SSH (ajusta si necesitas más seguridad)
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Acceso al microservicio
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
