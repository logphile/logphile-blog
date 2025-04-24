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

<div class="post-heading-container">
<img src="/icons/logphile-question.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    What's the Difference?
  </div>
</div>

- *Az* is for managing *Azure resources*—think subscriptions, VMs, networking, storage.
- *Microsoft.Graph* is for managing *Microsoft Entra ID* (Azure AD) and Microsoft 365 identities—users, groups, licenses, directory roles.

They're both used in the Azure ecosystem, but they hit different APIs and serve different layers.

---

<div class="post-heading-container">
<img src="/icons/logphile-scale.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Comparison Matrix
  </div>
</div>

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

<div class="post-heading-container">
<img src="/icons/logphile-magnify.svg" alt="Alert" width="90" height="90" />
  <div class="post-headings">
    Syntax Side-by-Side
  </div>
</div>


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

<div class="post-heading-container">
<img src="/icons/logphile-magnify.svg" alt="Alert" width="90" height="90" />
  <div class="post-headings">
    Syntax Side-by-Side
  </div>
</div>

Here’s a practical scenario:

- Use *Microsoft.Graph* to create a user and assign them a role in Entra ID.
- Then use *Az* to grant that user access to a resource group with *New-AzRoleAssignment*.

It's not either/or—it’s knowing when each tool is appropriate.

---

<div class="post-heading-container">
<img src="/icons/logphile-lightbulb.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    When: Az vs. Graph
  </div>
</div>

- If you’re dealing with *subscriptions*, *infra*, *RBAC*, use *Az*.
- If you’re touching *users*, *groups*, *licenses*, *roles*, use *Microsoft.Graph*.
- Want automation across both? Combine them in the same script—just authenticate each separately.

---

<div class="post-heading-container">
<img src="/icons/logphile-paperclip.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    References
  </div>
</div>

- [Microsoft.Graph PowerShell Docs](https://learn.microsoft.com/en-us/powershell/microsoftgraph/overview)
- [Az PowerShell Module Docs](https://learn.microsoft.com/en-us/powershell/azure/new-azureps-module-az)
- [Compare Az and AzureRM](https://learn.microsoft.com/en-us/powershell/azure/az-module)

---



{{< alert icon="fire" cardColor="#F4227A" textColor="#FFD808">}}
Thanks for reading. I stepped away to be a stay-at-home dad and now plugging back in—one post, one project at a time. <b>LogPhile</b> is a learning log, a signal to employers, and proof of progress. Spot a mistake? Edge case I missed? Just want to connect? Don’t hesitate to reach out.
{{< /alert >}}
