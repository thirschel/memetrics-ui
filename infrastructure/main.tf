locals {
  name       = "memetrics-${terraform.workspace}"
  short_name = "mm${lower(replace(terraform.workspace, "-", ""))}"
}

resource "azurerm_storage_account" "storage_account" {
  name                     = "${local.short_name}ui"
  location                 = var.infrastructure_resource_group_location
  resource_group_name      = var.infrastructure_resource_group_name
  account_tier             = "Standard"
  account_replication_type = "LRS"
  access_tier              = "Cool"
  account_kind             = "StorageV2"
  static_website {
    index_document         = "index.html"
    error_404_document     = "index.html"
  }

  tags = var.tags
}

resource "azurerm_cdn_profile" "cdn_profile" {
  name                = "${local.name}-cdn"
  location            = var.infrastructure_resource_group_location
  resource_group_name = var.infrastructure_resource_group_name
  sku                 = "Standard_Microsoft"
  tags                = var.tags
}

resource "azurerm_cdn_endpoint" "cdn_endpoint" {
  name                = "${local.name}-endpoint"
  profile_name        = azurerm_cdn_profile.cdn_profile.name
  location            = var.infrastructure_resource_group_location
  resource_group_name = var.infrastructure_resource_group_name

  origin {
    name      = "${local.name}-storage-account"
    host_name = "${azurerm_storage_account.storage_account.name}.z13.web.core.windows.net"

    // Custom domain is not supported https://github.com/terraform-providers/terraform-provider-azurerm/issues/398
  }

  origin_host_header = "${azurerm_storage_account.storage_account.name}.z13.web.core.windows.net"

  delivery_rule {
      name = "HttpsRedirect"
      order = 1
      request_scheme_condition {
          match_values = ["HTTP"]
          operator = "Equal"
      }
      url_redirect_action {
          redirect_type = "Found"
          protocol = "Https"
      }
  }
  
  tags               = var.tags
}
