---
title: "Faking an Org Chart in Entra: Mapping Hierarchies with PowerShell + Graph"
description: "Use Microsoft Graph and PowerShell to extract and visualize manager relationships in Microsoft Entra ID."
meta: "Extract org chart data from Microsoft Entra ID using PowerShell and Microsoft Graph. Build a tree view from manager properties and export to JSON or Graphviz."
date: 2025-03-23T12:00:00Z
featureimage: "logphile-spiderman-torn-mask-featured-post.jpg"
tags: ["entra id", "microsoft graph", "powershell", "org chart", "automation"]
categories: ["Azure Identity", "Automation"]
summary: "What if your org chart wasn’t buried in HR PDFs but lived where access decisions are made? Use Microsoft Graph to recursively trace Entra ID hierarchies."
draft: false
showHero: false
---

---

What if your org chart wasn’t buried in HR PDFs but lived where access decisions are made?

{{< glow >}}Microsoft Entra ID{{< /glow >}} supports a {{< glow >}}manager{{< /glow >}} property on each user object, which can be used to simulate an organizational chart—if populated correctly.

In this post, we’ll use {{< glow >}}PowerShell{{< /glow >}} and {{< glow >}}Microsoft Graph{{< /glow >}} to recursively build an org chart based on {{< glow >}}manager{{< /glow >}} relationships, then optionally export it to {{< glow >}}JSON{{< /glow >}} or {{< glow >}}Graphviz DOT{{< /glow >}} format for visualization.

---

<div class="post-heading-container">
<img src="/icons/logphile-diploma.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    What You'll Learn
  </div>
</div>

- How to query user-manager relationships with Microsoft Graph
- How to recursively walk Entra ID's hierarchy using PowerShell
- Where org chart data tends to break in the real world
- How to output to structured formats like JSON and DOT

---

<div class="post-heading-container">
<img src="/icons/logphile-potion.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Prerequisites
  </div>
</div>

```powershell
Install-Module Microsoft.Graph -Scope CurrentUser -Force
Connect-MgGraph -Scopes "User.Read.All", "Directory.Read.All"
```

---

<div class="post-heading-container">
<img src="/icons/logphile-key.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Key Graph Properties
  </div>
</div>

We’ll need:
- {{< glow >}}Id{{< /glow >}}
- {{< glow >}}DisplayName{{< /glow >}}
- {{< glow >}}UserPrincipalName{{< /glow >}}
- {{< glow >}}Department{{< /glow >}}
- {{< glow >}}Manager{{< /glow >}}

---

<div class="post-heading-container">
<img src="/icons/logphile-loop.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Recursive Org Chart Builder (PS)
  </div>
</div>


```powershell
function Get-OrgNode {
    param (
        [string]$UserId,
        [int]$Depth = 0
    )

    $user = Get-MgUser -UserId $UserId -Property "Id,DisplayName,UserPrincipalName,Department" -ErrorAction SilentlyContinue
    if (-not $user) { return }

    $indent = " " * ($Depth * 4)
    Write-Host "$indent├── $($user.DisplayName) [$($user.Department)]" -ForegroundColor Cyan

    $directReports = Get-MgUserDirectReport -UserId $UserId -ErrorAction SilentlyContinue

    foreach ($report in $directReports) {
        Get-OrgNode -UserId $report.Id -Depth ($Depth + 1)
    }
}

# Replace with the ID of your top-level manager (e.g., CEO or head of department)
$rootUser = Get-MgUser -Filter "displayName eq 'Charles Xavier'"
Get-OrgNode -UserId $rootUser.Id
```
---

<div class="post-heading-container">
<img src="/icons/logphile-bonus.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    The Result
  </div>
</div>


```bash
PS C:\Users\logphile>function Get-OrgNode {
    param (
        [string]$UserId,
        [int]$Depth = 0
    )
    $user = Get-MgUser -UserId $UserId -Property "Id,DisplayName,UserPrincipalName,Department" -ErrorAction SilentlyContinue
    if (-not $user) { return }
    $indent = " " * ($Depth * 4)
    Write-Host "$indent├── $($user.DisplayName) [$($user.Department)]" -ForegroundColor Cyan
    $directReports = Get-MgUserDirectReport -UserId $UserId -ErrorAction SilentlyContinue
    foreach ($report in $directReports) {
        Get-OrgNode -UserId $report.Id -Depth ($Depth + 1)
    }
}
# Replace with the ID of your top-level manager (e.g., CEO or head of department)
$rootUser = Get-MgUser -Filter "displayName eq 'Charles Xavier'"
Get-OrgNode -UserId $rootUser.Id

├── Charles Xavier [Leadership]
    ├── Ororo Munroe [Mutant Affairs]
        ├── Scott Summers [Field Operations]
            ├── Hisako Ichiki [Field Operations]
        ├── Warren Worthington [Finance]
        ├── Bobby Drake [Field Operations]
        ├── James Howlett [Security]
            ├── Laura Kinney [Security]
        ├── Piotr Nikolayevich Rasputin [Field Operations]
        ├── Kurt Wagner [Teleportation Ops]
            ├── Megan Gwynn [Teleportation Ops]
            ├── Clarice Ferguson [Teleportation Ops]
    ├── Hank McCoy [Science Division]
        ├── Forge [Science Division]
    ├── Tessa [Information Technology]
PS C:\Users\logphile>

```

---

<div class="post-heading-container">
<img src="/icons/logphile-export.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Export to JSON (Optional)
  </div>
</div>

```powershell
function Build-OrgTreeJson {
    param ([string]$UserId)

    $user = Get-MgUser -UserId $UserId -Property "Id,DisplayName,UserPrincipalName,Department"
    $directReports = Get-MgUserDirectReport -UserId $UserId

    $children = foreach ($report in $directReports) {
        Build-OrgTreeJson -UserId $report.Id
    }

    return [PSCustomObject]@{
        Name       = $user.DisplayName
        UPN        = $user.UserPrincipalName
        Department = $user.Department
        Reports    = $children
    }
}

# Get the root node (replace with your actual root if needed)
$rootUser = Get-MgUser -Filter "displayName eq 'Charles Xavier'"

# Build the tree
$tree = Build-OrgTreeJson -UserId $rootUser.Id

# Export to JSON
$tree | ConvertTo-Json -Depth 10 | Out-File ".\\orgTree.json" -Encoding utf8
```

```json
{
  "Name": "Charles Xavier",
  "UPN": "profx@logphile.com",
  "Department": "Leadership",
  "Reports": [
    {
      "Name": "Ororo Munroe",
      "UPN": "storm@logphile.com",
      "Department": "Mutant Affairs",
      "Reports": [
        {
          "Name": "Scott Summers",
          "UPN": "cyclops@logphile.com",
          "Department": "Field Operations",
          "Reports": {
            "Name": "Hisako Ichiki",
            "UPN": "armor@logphile.com",
            "Department": "Field Operations",
            "Reports": null
          }
        },
        {
          "Name": "Warren Worthington",
          "UPN": "angel@logphile.com",
          "Department": "Finance",
          "Reports": null
        },
        {
          "Name": "Bobby Drake",
          "UPN": "iceman@logphile.com",
          "Department": "Field Operations",
          "Reports": null
        },
        {
          "Name": "James Howlett",
          "UPN": "wolverine@logphile.com",
          "Department": "Security",
          "Reports": {
            "Name": "Laura Kinney",
            "UPN": "x23@logphile.com",
            "Department": "Security",
            "Reports": null
          }
        },
        {
          "Name": "Piotr Nikolayevich Rasputin",
          "UPN": "colossus@logphile.com",
          "Department": "Field Operations",
          "Reports": null
        },
        {
          "Name": "Kurt Wagner",
          "UPN": "nightcrawler@logphile.com",
          "Department": "Teleportation Ops",
          "Reports": [
            {
              "Name": "Megan Gwynn",
              "UPN": "pixie@logphile.com",
              "Department": "Teleportation Ops",
              "Reports": null
            },
            {
              "Name": "Clarice Ferguson",
              "UPN": "blink@logphile.com",
              "Department": "Teleportation Ops",
              "Reports": null
            }
          ]
        }
      ]
    },
    {
      "Name": "Hank McCoy",
      "UPN": "beast@logphile.com",
      "Department": "Science Division",
      "Reports": {
        "Name": "Forge",
        "UPN": "forge@logphile.com",
        "Department": "Science Division",
        "Reports": null
      }
    },
    {
      "Name": "Tessa",
      "UPN": "sage@logphile.com",
      "Department": "Information Technology",
      "Reports": null
    }
  ]
}
```

---

<div class="post-heading-container">
<img src="/icons/logphile-breaks.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Where This Breaks
  </div>
</div>

- Missing {{< glow >}}manager{{< /glow >}} field = orphaned node
- Cycles (rare but possible in messy directories)
- Manager points to deactivated or deleted accounts
- Top-level user has no {{< glow >}}manager{{< /glow >}} = must start with known name

---

<div class="post-heading-container">
<img src="/icons/logphile-bonus.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Bonus: Graphviz DOT Export
  </div>
</div>


```powershell
function Export-ToDot {
    param ([object]$Node)

    $lines = @()
    foreach ($report in $Node.Reports) {
        $lines += "`"{0}`" -> `"{1}`"" -f $Node.Name, $report.Name
        $lines += Export-ToDot -Node $report
    }
    return $lines
}

$dot = @(
    "digraph OrgChart {",
    "    node [shape=box style=filled color=\"#E3F2FD\" fontname=\"Segoe UI\" fontsize=10];",
    "    edge [arrowhead=vee color=\"#90CAF9\"];"
)
$dot += Export-ToDot -Node $tree
$dot += "}"
$dot -join "`n" | Out-File ".\\orgchart.dot"
```
## Run New *orgchart.dot* Through GraphViz

```cmd
C:\Users\logphile>dot -Tpng orgchart.dot -o orgchart.png
```
---
<div class="post-heading-container">
<img src="/icons/logphile-results.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    The Results
  </div>
</div>

{{< figure src="/logphile-graphviz-simple-orgchart.png" class="wider-image no-zoom" >}}

GraphViz can display data in a lot of cool ways. We can add color and more data.

{{< figure src="/logphile-graphviz-enhanced-orgchart.png" class="wider-image no-zoom" >}}


Want your org chart to update itself? Use this with Azure Automation or GitHub Actions and post the output to Teams or SharePoint. Clean. Reusable. Always current.

---

<div class="post-heading-container">
<img src="/icons/logphile-paperclip.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    References
  </div>
</div>

- [Microsoft Graph `manager` relationship](https://learn.microsoft.com/en-us/graph/api/user-list-manager)
- [Graphviz Online Renderer](https://dreampuf.github.io/GraphvizOnline/)
- [Get-MgUserDirectReport Docs](https://learn.microsoft.com/en-us/powershell/module/microsoft.graph.users/get-mguserdirectreport)

---

{{< alert icon="fire" cardColor="#F4227A" textColor="#FFD808">}}
Thanks for reading. I stepped away to be a stay-at-home dad and now plugging back in—one post, one project at a time. <b>LogPhile</b> is a learning log, a signal to employers, and proof of progress. Spot a mistake? Edge case I missed? Just want to connect? Don’t hesitate to reach out.
{{< /alert >}}
