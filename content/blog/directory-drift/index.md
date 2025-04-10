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

If it's not in Entra, it doesn't exist—to your policies, dynamic groups, or audit logs. Missing user metadata like `department`, `title`, or `usageLocation` can silently break downstream automations and cause inconsistencies that are hard to debug.  

This post walks through how to **audit Entra ID user profiles** using **PowerShell and Microsoft Graph**, flagging any accounts with incomplete or empty property fields.

---


{{< figure src="/icons/face-lock-EntraDrift.svg" alt="Lock Icon" class="icon-inline" >}}

## ⚙️ Prerequisites

- PowerShell 7+
- [Microsoft Graph PowerShell SDK](https://learn.microsoft.com/en-us/powershell/microsoftgraph/installation)
- Admin permissions to Microsoft Entra ID

```powershell
Install-Module Microsoft.Graph -Scope CurrentUser
Connect-MgGraph -Scopes "User.Read.All", "Directory.Read.All"
```

{{< alert icon="circle-info" cardColor="#F5F4F1" iconColor="#FC5749" textColor="#2D2C36" >}}
Note: You only need read access for this operation, not User.Write.All.
{{< /alert >}}

---

## 🔍 Properties We’re Auditing

We’ll be checking each user for the following missing or blank fields:

- `department`
- `jobTitle`
- `usageLocation`
- `manager`
- `mobilePhone`, `officeLocation` (both optional)

You can customize this based on your environment.

---

## 🛠️ PowerShell Script

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

## 🧾 The Results

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

## 📤 Exporting to CSV (Optional)

```powershell
$results | Export-Csv -Path "EntraUserAudit.csv" -NoTypeInformation
```

{{< figure src="/logphile-csv-missing-properties.png" class="wider-image no-zoom" >}}

---

## 🧠 Why This Matters

- Broken dynamic group rules  
- License assignment failures  
- Inaccurate compliance or org charts  
- Missed automation triggers  

Directory drift happens quietly. This gives you visibility and control.

---

## 🚀 Ideas to Extend This

- Auto-tag users with `profileStatus = incomplete`
- Send Teams alerts or email summaries
- Schedule via Azure Automation or GitHub Actions

---

## 📎 Resources

- [Microsoft Graph PowerShell SDK Docs](https://learn.microsoft.com/en-us/powershell/microsoftgraph/overview)
- [User Resource Type - Microsoft Graph](https://learn.microsoft.com/en-us/graph/api/resources/user)
- [Graph Query Parameters Reference](https://learn.microsoft.com/en-us/graph/query-parameters)

---

{{< alert icon="fire" cardColor="#FC5749" textColor="#F5F4F1">}}
After several years as a stay-at-home dad, I'm working my way back into the tech field—brushing up on tools, learning what’s changed, and sharing the journey along the way. This blog is part learning tool, part signal to employers, and part proof of work. Thanks for reading!
{{< /alert >}}