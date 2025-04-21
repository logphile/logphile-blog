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

{{< headingrow icon="logphile-hourglass" text="A (Very) Brief History of Microsoft Graph" >}}

Introduced in 2015, Microsoft Graph unified dozens of fragmented Microsoft APIs—Azure AD, Exchange, SharePoint, Teams—into a single, modern endpoint. It's now the backbone of identity and data access across Microsoft 365 and Azure services. Microsoft is phasing out older modules like AzureAD and MSOnline in favor of Graph, making it the go-to tool for cloud-native management and automation.


{{< headingrow icon="logphile-brain" text="Smarter Entra ID User Creation with PowerShell + Graph" >}}


Here’s how to automate Entra ID user creation using PowerShell and Microsoft Graph—with smart defaults, error handling, and dynamic group assignment. Creating users through the Azure Portal works... until it doesn’t. Once you’re dealing with onboarding, consistency, or dynamic environments, it’s time to automate. 

{{< headingrow icon="logphile-checklist" text="Prerequisites" >}}

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

{{< headingrow icon="logphile-define" text="Define the User Creation Function" >}}

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

{{< headingrow icon="logphile-potion" text="Let's Create a User" >}}

```bash
New-SmartUser -DisplayName "Beast" `
    -UserPrincipalName "hank.mccoy@logphile.com" `
    -Password "l1n3arFus1on" `
    -Department "R&D" `
    -GroupName "Research & Development"
```

{{< headingrow icon="logphile-bonus" text="The Results" >}}

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

{{< headingrow icon="logphile-badge" text="Verify in the Portal" >}}

Log into Entra ID > Users and confirm the user shows up with correct info.

{{< figure src="/logphile-user-beast-created.png" class="wider-image no-zoom" >}}

Then check Groups to confirm group creation and membership.

{{< figure src="/logphile-group-created-beast-added.png" class="wider-image no-zoom" >}}

---

{{< headingrow icon="logphile-chip" text="Why This Matters" >}}

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

{{< headingrow icon="logphile-pirate" text="What's Next?" >}}

- Make password generation secure (use New-Guid, or integrate with a vault)
- Add license assignment via New-MgUserLicense
- Export logs or send Teams alerts on creation
- Bundle into a CI pipeline using GitHub Actions or Azure DevOps

---

{{< headingrow icon="logphile-question" text="Why Use PowerShell + Graph Over the Portal?" >}}

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

{{< headingrow icon="logphile-scale" text="Comparison: Portal vs Legacy PowerShell vs Graph + PowerShell" >}}


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

{{< headingrow icon="logphile-bonus" text="Bonus" >}}

- [Microsoft Graph PowerShell SDK Docs](https://learn.microsoft.com/en-us/powershell/microsoftgraph/overview)
- [User Object Docs](https://learn.microsoft.com/en-us/graph/api/resources/user)
- [Graph Permissions Guide](https://learn.microsoft.com/en-us/graph/permissions-reference)

---

{{< alert icon="fire" cardColor="#FC5749" textColor="#F5F4F1">}}
After several years as a stay-at-home dad, I'm working my way back into the tech field—brushing up on tools, learning what’s changed, and sharing the journey along the way. This blog is part learning tool, part signal to employers, and part proof of work. Thanks for reading!
{{< /alert >}}