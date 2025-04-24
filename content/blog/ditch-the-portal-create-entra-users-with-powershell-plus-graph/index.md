---
title: "Ditch the Portal: Create Entra Users with PowerShell + Graph"
description: "Logphile Article - How to automate Microsoft Entra ID user creation with Powershell and Microsoft Graph."
meta: "Learn how to automate Microsoft Entra ID user creation using PowerShell and Microsoft Graph. Skip the portal, reduce human error, and scale identity management."
date: 2025-03-18T12:00:00Z
featureimage: "logphile-beast-featured-post.png"
tags: ["microsoft graph", "powershell", "entra", "azure"]
categories: ["Azure Identity", "Automation"]
summary: "Ditch the portal and script like a pro—this post shows you how to create Entra ID users with PowerShell and Microsoft Graph for smarter, faster, mistake-free identity management."
draft: false
showHero: false
---

---

One-off user creation is fine—until you need scale, consistency, and future-proofing. That’s where Microsoft Graph comes in. In this post, I’ll walk you through how to create Microsoft Entra ID users using *PowerShell and Microsoft Graph*—with clean, scalable scripting.

---

<div class="post-heading-container">
<img src="/icons/logphile-hourglass.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    A Brief History of Microsoft Graph
  </div>
</div>


Introduced in 2015, Microsoft Graph unified dozens of fragmented Microsoft APIs—Azure AD, Exchange, SharePoint, Teams—into a single, modern endpoint. It's now the backbone of identity and data access across Microsoft 365 and Azure services. Microsoft is phasing out older modules like AzureAD and MSOnline in favor of Graph, making it the go-to tool for cloud-native management and automation.


<div class="post-heading-container">
<img src="/icons/logphile-brain.svg" alt="Alert" width="100" height="100" />
  <div class="post-headings">
    Smarter Entra ID User Creation with Powershell + Graph
  </div>
</div>


Here’s how to automate Entra ID user creation using PowerShell and Microsoft Graph—with smart defaults, error handling, and dynamic group assignment. Creating users through the Azure Portal works... until it doesn’t. Once you’re dealing with onboarding, consistency, or dynamic environments, it’s time to automate. 

<div class="post-heading-container">
<img src="/icons/logphile-checklist.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Prerequisites
  </div>
</div>

Before we start scripting, make sure you have:

- PowerShell 7+
- [Microsoft Graph PowerShell SDK](https://learn.microsoft.com/en-us/powershell/microsoftgraph/installation)
- Admin permissions to Microsoft Entra ID

```bash
Install-Module Microsoft.Graph -Scope CurrentUser
```

Authenticate:

```bash
Connect-MgGraph -Scopes "User.ReadWrite.All", "Group.ReadWrite.All", "Directory.Read.All"
```

{{< alert icon="tag" cardColor="#FC5749" iconColor="#F5F4F1" textColor="#2D2C36" >}}
You'll get a consent prompt to grant permission the first time.
{{< /alert >}}

---

<div class="post-heading-container">
<img src="/icons/logphile-define.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Define the User Creation Function
  </div>
</div>

Here’s a reusable PowerShell function that creates a user and adds them to a security group.

```bash
function New-SmartUser {
    param(
        [Parameter(Mandatory)] [string]$DisplayName,
        [Parameter(Mandatory)] [string]$UserPrincipalName,
        [Parameter(Mandatory)] [string]$Password,
        [Parameter(Mandatory)] [string]$Department,
        [Parameter()] [string]$GroupName = "Default Users"
    )

    # Create the user
    $user = New-MgUser -AccountEnabled:$true `
        -DisplayName $DisplayName `
        -MailNickname ($UserPrincipalName.Split("@")[0]) `
        -PasswordProfile @{ ForceChangePasswordNextSignIn = $true; Password = $Password } `
        -UserPrincipalName $UserPrincipalName `
        -Department $Department `
        -UsageLocation "US"

    Write-Host "User '$($user.DisplayName)' created successfully."

    # Find or create the group
    $group = Get-MgGroup -Filter "displayName eq '$GroupName'" -ErrorAction SilentlyContinue

    if (-not $group) {
        $group = New-MgGroup -DisplayName $GroupName `
            -MailEnabled:$false -MailNickname:$GroupName.Replace(" ", "") `
            -SecurityEnabled:$true -GroupTypes @()
        Write-Host "Group '$GroupName' created."
    }

    # Add user to group
    New-MgGroupMember -GroupId $group.Id -DirectoryObjectId $user.Id
    Write-Host "User added to group '$GroupName'."
}
```

---

<div class="post-heading-container">
<img src="/icons/logphile-potion.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Let's Create a User
  </div>
</div>

```bash
New-SmartUser -DisplayName "Beast" `
    -UserPrincipalName "hank.mccoy@logphile.com" `
    -Password "l1n3arFus1on" `
    -Department "R&D" `
    -GroupName "Research & Development"
```

<div class="post-heading-container">
<img src="/icons/logphile-bonus.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    The Results
  </div>
</div>

```bash
C:\Users\logphile> New-SmartUser -DisplayName "Beast" `
>>     -UserPrincipalName "hank.mccoy@logphile.com" `
>>     -Password "P@ssword123!" `
>>     -Department "R&D" `
>>     -GroupName "Research & Development"
User 'Beast' created successfully.
Group 'Research & Development' created.
User added to group 'Research & Development'.
```

---

<div class="post-heading-container">
<img src="/icons/logphile-badge.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Verify in the Portal
  </div>
</div>

Log into Entra ID > Users and confirm the user shows up with correct info.

{{< figure src="/logphile-user-beast-created.png" class="wider-image no-zoom" >}}

Then check Groups to confirm group creation and membership.

{{< figure src="/logphile-group-created-beast-added.png" class="wider-image no-zoom" >}}

---

<div class="post-heading-container">
<img src="/icons/logphile-chip.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Why This Matters
  </div>
</div>

Manual user creation introduces:

- Typos in emails or departments
- Missed group assignments
- No audit trail
- Automated creation ensures:
- Consistency
- Scalability
- Auditability

Plus, you’re scripting against Microsoft Graph—the modern way to manage Microsoft 365.

---

<div class="post-heading-container">
<img src="/icons/logphile-pirate.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    What's Next
  </div>
</div>

- Make password generation secure (use New-Guid, or integrate with a vault)
- Add license assignment via New-MgUserLicense
- Export logs or send Teams alerts on creation
- Bundle into a CI pipeline using GitHub Actions or Azure DevOps

---

<div class="post-heading-container">
<img src="/icons/logphile-question.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Why Use Powershell + Graph Over the Portal?
  </div>
</div>

Still using the Azure Portal or legacy PowerShell modules like `AzureAD` or `MSOnline`? Reasons to change:

<div class="grid purplecheck-spacing gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {{< purplecheck >}}**Modern + Supported:** Microsoft Graph is the future; older modules are deprecated.{{< /purplecheck >}}
  {{< purplecheck >}}**Scriptable + Auditable:** Build repeatable workflows and keep them in source control.{{< /purplecheck >}}
  {{< purplecheck >}}**Richer Control:** Set attributes, assign groups, and handle edge cases the portal hides.{{< /purplecheck >}}
  {{< purplecheck >}}**Cross-Tenant Ready:** Run the same script across multiple environments without clicking around.{{< /purplecheck >}}
  {{< purplecheck >}}**Least Privilege:** Use fine-grained Graph scopes instead of over-privileged admin accounts.{{< /purplecheck >}}
  {{< purplecheck >}}**Error Handling:** Catch issues like duplicate UPNs or missing license capacity in real-time.{{< /purplecheck >}}
</div>

---

<div class="post-heading-container">
<img src="/icons/logphile-scale.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Comparison: Portal vs. Legacy Powershell vs. Graph + Powershell
  </div>
</div>


| Feature                         | Portal | Old PowerShell (`AzureAD`) | Graph + PowerShell |
|-------------------------------|--------|-----------------------------|---------------------|
| Automation-ready              | ❌     | ✅                          | ✅✅                |
| Modern, supported             | ❌     | ⚠️ Deprecated               | ✅✅                |
| Full attribute support        | ❌     | ❌                          | ✅✅                |
| API-level consistency         | ❌     | ❌                          | ✅✅                |
| Fine-grained permissions      | ❌     | ❌                          | ✅✅                |
| Auditable/source-controllable | ❌     | ✅                          | ✅✅                |
| Scalable across tenants       | ❌     | ✅                          | ✅✅                |

---

<div class="post-heading-container">
<img src="/icons/logphile-bonus.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Bonus
  </div>
</div>

- [Microsoft Graph PowerShell SDK Docs](https://learn.microsoft.com/en-us/powershell/microsoftgraph/overview)
- [User Object Docs](https://learn.microsoft.com/en-us/graph/api/resources/user)
- [Graph Permissions Guide](https://learn.microsoft.com/en-us/graph/permissions-reference)

---

{{< alert icon="fire" cardColor="#F4227A" textColor="#FFD808">}}
Thanks for reading. I stepped away to be a stay-at-home dad and now plugging back in—one post, one project at a time. <b>LogPhile</b> is a learning log, a signal to employers, and proof of progress. Spot a mistake? Edge case I missed? Just want to connect? Don’t hesitate to reach out.
{{< /alert >}}