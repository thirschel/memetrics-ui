variable "infrastructure_resource_group_name" {
  description = "The name of the infrastructure resource group"
}

variable "infrastructure_resource_group_location" {
  description = "The location of the infrastructure resource group"
}

variable "tags" {
  description = "A mapping of tages to assign to the resource. Changing this forces a new resource to be created."
  default = {
    source  = "terraform"
    product = "MeMetrics"
  }
}
