---
title: "Directory Drift: Auditing Incomplete Entra User Profiles with PowerShell + Graph"
description: "Audit Microsoft Entra ID users for missing key properties using PowerShell and Microsoft Graph."
meta: "Check Microsoft Entra ID user profiles for missing department, title, and usageLocation using PowerShell and Graph. Prevent dynamic group failures and policy misfires."
date: 2025-03-28T12:00:00Z
featureimage: "logphile-profx-data-center-featured-post.png"
tags: ["entra id", "microsoft graph", "powershell", "automation", "user audit"]
categories: ["Azure Identity", "Automation"]
summary: "Missing user metadata can break your policies, groups, and reports. Learn how to audit Entra ID user profiles using PowerShell and Microsoft Graph."
draft: false
showHero: false
---

---

If it's not in Entra, it doesn't exist—to your policies, dynamic groups, or audit logs. Missing user metadata like {{< glow >}}department, {{< /glow >}}{{< glow >}}title, {{< /glow >}}or {{< glow >}}usageLocation{{< /glow >}}can silently break downstream automations and cause inconsistencies that are hard to debug.  

This post walks through how to{{< glow >}} audit Entra ID user profiles{{< /glow >}} using {{< glow >}}PowerShell and Microsoft Graph,{{< /glow >}} flagging any accounts with incomplete or empty property fields.

<div class="post-heading-container">
<img src="/icons/logphile-icon-fire.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Prerequisites
  </div>
</div>



- PowerShell 7+
- [Microsoft Graph PowerShell SDK](https://learn.microsoft.com/en-us/powershell/microsoftgraph/installation)
- Admin permissions to Microsoft Entra ID

```powershell
Install-Module Microsoft.Graph -Scope CurrentUser
Connect-MgGraph -Scopes "User.Read.All", "Directory.Read.All"
```

{{< alert icon="circle-info" cardColor="#F5F4F1" iconColor="#FC5749" textColor="#2D2C36" >}}
Note: You only need read access for this operation, not *User.Write.All*.
{{< /alert >}}

---

<div class="post-heading-container">
<img src="/icons/logphile-checklist.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Properties We're Auditing
  </div>
</div>

We’ll be checking each user for the following missing or blank fields:

- {{< glow >}}department{{< /glow >}}
- {{< glow >}}jobTitle{{< /glow >}}
- {{< glow >}}usageLocation{{< /glow >}}
- {{< glow >}}manager{{< /glow >}}
- {{< glow >}}mobilePhone{{< /glow >}}, {{< glow >}}officeLocation{{< /glow >}} (both optional)

You can customize this based on your environment.

---

<div class="post-heading-container">
<img src="/icons/logphile-powershell.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Powershell Script
  </div>
</div>

```powershell
$propertiesToCheck = @("Department", "JobTitle", "UsageLocation", "Manager", "MobilePhone", "OfficeLocation")
$results = @()

$users = Get-MgUser -All -Property "Id,DisplayName,UserPrincipalName,Department,JobTitle,UsageLocation,Manager,MobilePhone,OfficeLocation"

foreach ($user in $users) {
    $missingProps = @()
    foreach ($prop in $propertiesToCheck) {
        if (-not $user.$prop) {
            $missingProps += $prop
        }
    }

    if ($missingProps.Count -gt 0) {
        $results += [PSCustomObject]@{
            DisplayName = $user.DisplayName
            UserPrincipalName = $user.UserPrincipalName
            MissingProperties = ($missingProps -join ", ")
        }
    }
}

$results | Format-Table -AutoSize
```
---

<div class="post-heading-container">
<img src="/icons/logphile-results.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    The Results
  </div>
</div>

```bash
PS C:\Users\logphile> New-SmartUser $propertiesToCheck = @("Department", "JobTitle", "UsageLocation", "Manager", "MobilePhone", "OfficeLocation")
>> $results = @()
>> $users = Get-MgUser -All -Property "Id,DisplayName,UserPrincipalName,Department,JobTitle,UsageLocation,Manager,MobilePhone,OfficeLocation"
>> foreach ($user in $users) {
>>     $missingProps = @()
>>     foreach ($prop in $propertiesToCheck) {
>>         if (-not $user.$prop) {
>>             $missingProps += $prop
>>         }
>>     }
>>     if ($missingProps.Count -gt 0) {
>>         $results += [PSCustomObject]@{
>>             DisplayName = $user.DisplayName
>>             UserPrincipalName = $user.UserPrincipalName
>>             MissingProperties = ($missingProps -join ", ")
>>         }
>>     }
>> }
>> $results | Format-Table -AutoSize

DisplayName                         UserPrincipalName                            Missing Properties
-----------                         -----------------                            ------------------
Warren Worthington                  angel@logphile.com                           UsageLocation
Hank McCoy                          beast@logphile.com                           UsageLocation
Piotr Nikolayevich Rasputin         colossus@logphile.com                        UsageLocation
Scott Summers                       cyclops@logphile.com                         UsageLocation
Bobby Drake                         iceman@logphile.com                          UsageLocation
Jean Grey                           marvelgirl@logphile.com                      UsageLocation
Kurt Wagner                         nightcrawler@logphile.com                    OfficeLocation
Phil Boyce                          phil@logphile.com                            Department, JobTitle, MobilePhone, OfficeLocation            
Charles Xavier                      profx@logphile.com                           UsageLocation
James Howlett                       wolverine@logphile.com                       UsageLocation
```

---

<div class="post-heading-container">
<img src="/icons/logphile-export.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Exporting to CSV (Optional)
  </div>
</div>

```powershell
$results | Export-Csv -Path "EntraUserAudit.csv" -NoTypeInformation
```
{{< figure src="/logphile-csv-missing-properties.png" class="wider-image" attr="data-zoomable" >}}

---

<div class="post-heading-container">
<img src="/icons/logphile-brain.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Why This Matters
  </div>
</div>

- Broken dynamic group rules  
- License assignment failures  
- Inaccurate compliance or org charts  
- Missed automation triggers  

Directory drift happens quietly. This gives you visibility and control.

---

<div class="post-heading-container">
<img src="/icons/logphile-extend.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Ideas to Extend This
  </div>
</div>

- Auto-tag users with {{< glow >}}profileStatus = incomplete{{< /glow >}}
- Send Teams alerts or email summaries
- Schedule via Azure Automation or GitHub Actions

---

<div class="post-heading-container">
<img src="/icons/logphile-paperclip.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    References
  </div>
</div>

- [Microsoft Graph PowerShell SDK Docs](https://learn.microsoft.com/en-us/powershell/microsoftgraph/overview)
- [User Resource Type - Microsoft Graph](https://learn.microsoft.com/en-us/graph/api/resources/user)
- [Graph Query Parameters Reference](https://learn.microsoft.com/en-us/graph/query-parameters)

---

<div class=post-closing>
Thanks for reading. I stepped away to be a stay-at-home dad and now plugging back in—one post, one project at a time. <b>LogPhile</b> is a learning log, a signal to employers, and proof of progress. Spot a mistake? Edge case I missed? Just want to connect? Don’t hesitate to reach out.
</div>