---
title: "X-Men Colors in the Windows Terminal"
description: "A fun and nostalgic Windows Terminal theme inspired by the 90s X-Men comic era, using bold blues, yellows, and whites for a clean and readable terminal experience."
date: 2025-03-24T12:00:00Z
featureimage: "logphile-storm-interface-featured-post.png"
tags: ["windows", "terminal", "themes", "customization", "x-men"]
categories: ["tools", "workflow"]
summary: "Channel Jim Lee’s 90s X-Men in your Windows Terminal without the comic book store smell. A simple tweak that makes terminal life a little less painful."
draft: false
showHero: false
---

---

After a fresh install recently, I took the opportunity to rebuild my terminal environment.

X-Men was one of the first comic books I picked up. Who can forget that blue, yellow, and white color palette that dominated the 90s comics during Jim Lee’s iconic run. It was the perfect balance of bold, clean, and readable. Hopefully this Windows Terminal color scheme across the same way.

---

<div class="post-heading-container">
<img src="/icons/logphile-brain.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    X-Men Colors in the Terminal
  </div>
</div>

Here’s a snapshot of the terminal with the theme applied:

{{< figure-zoom src="/xmen-preview.png" caption="Preview of Windows Terminal using X-Men colors." class="wider-image" attr="data-zoomable" >}}


And here’s the color scheme you can drop into your settings.json:

```bash
{
  "name": "X-Men",
  "background": "#0D1117", 
  "foreground": "#F8F8F2", 
  "cursorColor": "#FFD700",
  "selectionBackground": "#1A1F29",
  "black": "#0D1117",
  "red": "#FFD54F",
  "green": "#FFEA00",
  "yellow": "#FFF176",
  "blue": "#2196F3",
  "purple": "#42A5F5",
  "cyan": "#90CAF9",
  "white": "#F8F8F2",
  "brightBlack": "#20232A",
  "brightRed": "#FFE082",
  "brightGreen": "#FFF59D",
  "brightYellow": "#FFEB3B",
  "brightBlue": "#64B5F6",
  "brightPurple": "#90CAF9",
  "brightCyan": "#BBDEFB",
  "brightWhite": "#FFFFFF"
}
```

Colors used in this theme:
{{< swatches "#0D1117" "#F8F8F2" "#FFD700" >}}
{{< swatches "#1A1F29" "#FFD54F" "#FFEA00" >}}
{{< swatches "#FFF176" "#2196F3" "#42A5F5" >}}
{{< swatches "#90CAF9" "#20232A" "#FFE082" >}}
{{< swatches "#BBDEFB" "#FFFFFF" >}}

---

{{< alert cardColor="#FC5749" iconColor="#F5F4F1" textColor="#2D2C36" >}}
If you're new to Windows Terminal and asking where the settings.json file is...
{{< /alert >}}

1. Open {{< glow >}}Windows Terminal{{< /glow >}}
2. Hit {{< glow >}}Ctrl{{< /glow >}} + {{< glow >}},{{< /glow >}}
3. Click {{< glow >}}Open JSON{{< /glow >}} file in the bottom left.

---

{{< alert icon="fire" cardColor="#FC5749" iconColor="#F5F4F1" textColor="#2D2C36" >}}
Just make sure to set your terminal profile to use **"colorScheme": "X-Men"**!
{{< /alert >}}
<br>

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

```

---

<div class="post-heading-container">
<img src="/icons/logphile-question.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Why Customize?
  </div>
</div>

If you spend hours a day in the terminal, it should be a place that feels good to be in—like Storm’s hot tub, sipping wine—not a 1v1 with Wolverine in the Danger Room. Changes that make life easier on your eyes and help create a more focused, personalized workspace add up—and should absolutely be taken advantage of.

**Go down the customization rabbit hole:**

* [Nerd Fonts](https://www.nerdfonts.com/)
* [Starship Cross-Shell Prompt](https://starship.rs/)
* [Oh My Posh](https://ohmyposh.dev/)
* [Powerline Fonts](https://github.com/powerline/fonts)
* [Oh My Zsh](https://ohmyz.sh/)

---

<div class="post-heading-container">
<img src="/icons/logphile-bonus.svg" alt="Alert" width="75" height="75" />
  <div class="post-headings">
    Bonus
  </div>
</div>

I highly recommend *[Windows Terminal Themes](https://windowsterminalthemes.dev/)* to explore more themes. It’s a simple site that lets you browse and copy themes with a click — super useful when hunting for new ideas.

---
  
{{< alert icon="fire" cardColor="#F4227A" textColor="#FFD808">}}
Thanks for reading. I stepped away to be a stay-at-home dad and now plugging back in—one post, one project at a time. <b>LogPhile</b> is a learning log, a signal to employers, and proof of progress. Spot a mistake? Edge case I missed? Just want to connect? Don’t hesitate to reach out.
{{< /alert >}}