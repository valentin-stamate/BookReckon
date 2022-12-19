terraform {
  backend "s3" {
    bucket = "terraform-bookrecon-states"
    key = "bookrecon/secrets/terraform.tfstate"
    region = "us-east-1"

    # DynamoDB Configuration
    dynamodb_table = "terraform-bookrecon-locks"
    encrypt = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.47.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "3.4.3"
    }
  }

  # That's the Terraform version
  required_version = ">= v1.2.0"
}
