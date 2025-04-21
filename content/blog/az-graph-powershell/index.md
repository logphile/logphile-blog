---
title: "Az vs Graph: What PowerShell Module to Use (and When)"
description: "Understand the difference between the Az and Microsoft.Graph PowerShell modules—and when to use which."
meta: "Az module vs Microsoft Graph PowerShell module. When to use each for Azure and Entra ID management. Clear matrix and examples provided."
date: 2025-03-22T12:00:00Z
featureimage: "logphile-hulk-vs-wolverine-featured-post.png"
tags: ["azure", "entra id", "powershell", "microsoft graph", "az module"]
categories: ["Azure Identity", "PowerShell"]
summary: "Azure has two major PowerShell modules: Az and Microsoft.Graph. Learn when to use each, why it matters, and how they overlap."
draft: false
showHero: false
---

---

> *“Why do I need two different PowerShell modules just to manage Azure?”*

That’s the common frustration—*Az* and *Microsoft.Graph* are both official modules, but they serve completely different purposes. This post breaks down when to use each, with examples, a comparison matrix, and tips for choosing the right one.

---

{{< headingrow icon="logphile-question" text="What's the Difference?" >}}

- *Az* is for managing *Azure resources*—think subscriptions, VMs, networking, storage.
- *Microsoft.Graph* is for managing *Microsoft Entra ID* (Azure AD) and Microsoft 365 identities—users, groups, licenses, directory roles.

They're both used in the Azure ecosystem, but they hit different APIs and serve different layers.

---

{{< headingrow icon="logphile-scale" text="Comparison Matrix" >}}

| Feature / Action                             | `Az` Module             | `Microsoft.Graph` Module       | Use This When…                                  |
|---------------------------------------------|-------------------------|-------------------------------|-------------------------------------------------|
| Create/Manage VMs, Storage, etc.            | ✅ `Az.Compute`, etc.    | ❌                            | You’re managing Azure infrastructure.           |
| Create/Update Users & Groups in Entra ID    | ❌                      | ✅ `Microsoft.Graph.Users`     | You’re managing Entra identity objects.         |
| Assign RBAC Roles to Azure resources        | ✅                       | ✅ (via role assignments)      | Either works, but `Az` is more common.          |
| Create/Manage Subscriptions & Resource Groups | ✅ `Az.Resources`       | ❌                            | Managing the Azure structure itself.            |
| Assign Microsoft 365 licenses               | ❌                      | ✅ `Microsoft.Graph.Licenses`  | Working with SaaS identity entitlements.        |
| Use Azure Policy / ARM Templates            | ✅                       | ❌                            | Infrastructure governance and templates.        |
| Modify Conditional Access / Entra Policies  | ❌                      | ✅                             | Identity security config.                       |
| Read/Write Entra Group Memberships          | ❌                      | ✅                             | Directory group automation.                     |
| Automate Identity Lifecycle (HR sync, etc.) | ❌                      | ✅                             | Microsoft Graph is the only option.             |

---

{{< headingrow icon="logphile-question" text="Syntax Side-by-Side" >}}


### Create Resource Group (Az)
```powershell
Connect-AzAccount
New-AzResourceGroup -Name "dev-rg" -Location "eastus"
```

### Create Entra User (Graph)

```powershell
Connect-MgGraph -Scopes "User.ReadWrite.All"
New-MgUser -DisplayName "Logphile Test" -UserPrincipalName "logtest@domain.com" -MailNickname "logtest" -AccountEnabled:$true -PasswordProfile @{
    Password = "SecurePass123!"
}
```

---

{{< headingrow icon="logphile-brain" text="Syntax Side-by-Side" >}}

Here’s a practical scenario:

- Use *Microsoft.Graph* to create a user and assign them a role in Entra ID.
- Then use *Az* to grant that user access to a resource group with *New-AzRoleAssignment*.

It's not either/or—it’s knowing when each tool is appropriate.

---

{{< headingrow icon="logphile-lightbulb" text="Syntax Side-by-Side" >}}

- If you’re dealing with *subscriptions*, *infra*, *RBAC*, use *Az*.
- If you’re touching *users*, *groups*, *licenses*, *roles*, use *Microsoft.Graph*.
- Want automation across both? Combine them in the same script—just authenticate each separately.

---

{{< headingrow icon="logphile-paperclip" text="References" >}}

- [Microsoft.Graph PowerShell Docs](https://learn.microsoft.com/en-us/powershell/microsoftgraph/overview)
- [Az PowerShell Module Docs](https://learn.microsoft.com/en-us/powershell/azure/new-azureps-module-az)
- [Compare Az and AzureRM](https://learn.microsoft.com/en-us/powershell/azure/az-module)

---



{{< alert icon="fire" cardColor="#FC5749" textColor="#F5F4F1">}}
After several years as a stay-at-home dad, I'm working my way back into the tech field—brushing up on tools, learning what’s changed, and sharing the journey along the way. This blog is part learning tool, part signal to employers, and part proof of work. Thanks for reading!
{{< /alert >}}
