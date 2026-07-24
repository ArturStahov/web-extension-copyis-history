You are a Senior Vue 3 + UnoCSS + Web Extension Developer. 
I am updating the UI of my Chrome Extension (Manifest V3). 
Here is my current project structure (relevant parts):
- `unocss.config.ts`
- `src/styles/main.css`
- `src/components/PopupContentHeader.vue`
- `src/components/PopupContentListItem.vue`
- `src/components/PopupContentCustomCreateItem.vue`
- `src/components/ButtonComponent.vue`
- `src/services/` and `src/logic/` (state and storage management)

I have redesigned 3 main screens of the popup:
1. Main screen (list of copied text history)
2. Create custom record screen
3. Favorite tabs screen

I am providing you with:
1. Screenshots of the target UI for all 3 screens.
2. The HTML/Tailwind prototype code for the "Favorite" screen design system and layout.

read DOC before start /home/rokkart/WORK/HOME_MADE/CHROME_EXTENSIONS/copybook-extension/DOC

<HTML_PROTOTYPE>
1) copy tab example
<!DOCTYPE html><html class="dark" lang="en" style=""><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>ClipFlow - Clipboard History</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=JetBrains+Mono&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;
        }
        ::-webkit-scrollbar {
            width: 4px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: #334155;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #475569;
        }
        .glass-blur {
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-error": "#690005",
                        "background": "#0b1326",
                        "surface-tint": "#3cddc7",
                        "surface-container-low": "#131b2e",
                        "surface-container-high": "#222a3d",
                        "on-background": "#dae2fd",
                        "surface-bright": "#31394d",
                        "on-primary-fixed-variant": "#005047",
                        "on-primary": "#003731",
                        "primary-fixed-dim": "#3cddc7",
                        "inverse-on-surface": "#283044",
                        "primary-container": "#2dd4bf",
                        "inverse-surface": "#dae2fd",
                        "surface-container": "#171f33",
                        "secondary-fixed-dim": "#a4c9ff",
                        "on-secondary-fixed-variant": "#004883",
                        "outline": "#859490",
                        "on-secondary-fixed": "#001c39",
                        "primary": "#57f1db",
                        "on-surface-variant": "#bacac5",
                        "on-tertiary-container": "#744000",
                        "tertiary-fixed": "#ffdcc0",
                        "on-tertiary-fixed": "#2d1600",
                        "tertiary": "#ffd1aa",
                        "secondary-container": "#0267b8",
                        "surface-dim": "#0b1326",
                        "tertiary-fixed-dim": "#ffb875",
                        "primary-fixed": "#62fae3",
                        "surface-container-highest": "#2d3449",
                        "on-secondary-container": "#d6e5ff",
                        "on-primary-container": "#00574d",
                        "tertiary-container": "#ffac5a",
                        "outline-variant": "#3c4a46",
                        "inverse-primary": "#006b5f",
                        "secondary-fixed": "#d4e3ff",
                        "error": "#ffb4ab",
                        "on-error-container": "#ffdad6",
                        "surface-variant": "#2d3449",
                        "on-tertiary-fixed-variant": "#6b3b00",
                        "surface": "#0b1326",
                        "on-primary-fixed": "#00201c",
                        "on-tertiary": "#4b2800",
                        "secondary": "#a4c9ff",
                        "on-surface": "#dae2fd",
                        "surface-container-lowest": "#060e20",
                        "on-secondary": "#00315d",
                        "error-container": "#93000a"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "item-padding": "0.875rem",
                        "stack-gap": "0.75rem",
                        "container-padding": "1rem",
                        "inner-gap": "0.5rem"
                    },
                    "fontFamily": {
                        "body-sm": ["Inter"],
                        "mono-sm": ["JetBrains Mono"],
                        "label-sm": ["Inter"],
                        "label-lg": ["Inter"],
                        "body-md": ["Inter"],
                        "headline-md": ["Inter"]
                    },
                    "fontSize": {
                        "body-sm": ["13px", {"lineHeight": "18px", "fontWeight": "400"}],
                        "mono-sm": ["12px", {"lineHeight": "16px", "fontWeight": "400"}],
                        "label-sm": ["11px", {"lineHeight": "14px", "fontWeight": "500"}],
                        "label-lg": ["12px", {"lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "600"}],
                        "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "headline-md": ["18px", {"lineHeight": "24px", "letterSpacing": "-0.01em", "fontWeight": "600"}]
                    }
                },
            },
        }
    </script>
</head>
<body class="bg-background text-on-background min-h-screen flex justify-center selection:bg-primary-container selection:text-on-primary-container">
<!-- Chrome Extension Wrapper -->
<div class="w-full max-w-[400px] h-[600px] flex flex-col bg-surface overflow-hidden relative border border-outline-variant shadow-2xl">
<!-- TopAppBar (JSON Instruction Applied) -->
<header class="sticky top-0 z-50 flex items-center justify-between p-container-padding bg-surface-container border-b border-outline-variant">
<div class="flex items-center gap-inner-gap">

<h1 class="font-headline-md text-headline-md font-bold text-primary">ClipFlow</h1>
</div>
<div class="flex items-center gap-inner-gap">
<div class="relative group">
<input class="bg-surface-container-lowest border-none rounded-lg py-1 pl-8 pr-3 text-body-sm w-32 focus:w-48 focus:ring-1 focus:ring-primary transition-all duration-300" placeholder="Search..." type="text">
<span class="material-symbols-outlined absolute left-2 top-1.5 text-on-surface-variant text-[18px]">search</span>
</div>
</div>
</header>
<!-- Main Content Area -->
<main class="flex-1 overflow-y-auto p-container-padding pb-20 space-y-stack-gap">
<!-- Date Section -->
<section class="space-y-inner-gap">
<div class="sticky top-0 py-2 bg-surface/90 glass-blur z-10 flex items-center justify-center">
<span class="font-label-lg text-label-lg text-primary bg-surface-container-high px-3 py-0.5 rounded-full border border-outline-variant/30">Friday, July 24, 2026</span>
</div>
<!-- Clipboard Item (Link) -->
<div class="group relative flex flex-col p-item-padding bg-surface-container rounded-xl border border-transparent hover:border-outline-variant hover:bg-surface-container-high transition-all duration-200"><div class="flex justify-between items-start gap-inner-gap mb-1"><div class="flex-1 min-w-0"><p class="font-label-sm text-label-sm text-primary truncate">https://gemini.google.com/app/6829f...</p></div><span class="font-label-sm text-label-sm text-on-surface-variant shrink-0">13:34</span></div><div class="flex-1 min-w-0"><p class="font-mono-sm text-mono-sm text-on-background line-clamp-2 transition-all duration-300">This is the actual clipboard content snippet that would be copied from the source above. It provides context for the link.</p></div><div class="flex justify-between items-center mt-2"><button class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1" onclick="const p = this.closest('.group').querySelector('p.text-on-background'); p.classList.toggle('line-clamp-2'); this.querySelector('span').textContent = p.classList.contains('line-clamp-2') ? 'expand_more' : 'expand_less'"><span class="material-symbols-outlined text-[18px]">expand_more</span><span class="text-label-sm">More</span></button><div class="flex items-center gap-4 transition-opacity absolute top-2 right-2"><button class="text-on-surface-variant hover:text-primary transition-colors" title="Copy"><span class="material-symbols-outlined text-[18px]">content_copy</span></button><button class="text-on-surface-variant hover:text-primary transition-colors" title="Favorite"><span class="material-symbols-outlined text-[18px]">star</span></button><button class="text-on-surface-variant hover:text-error transition-colors" title="Delete"><span class="material-symbols-outlined text-[18px]">delete</span></button></div></div></div>
<!-- Clipboard Item (Code snippet) -->
<div class="group relative flex flex-col p-item-padding bg-surface-container rounded-xl border border-transparent hover:border-outline-variant hover:bg-surface-container-high transition-all duration-200"><div class="flex justify-between items-start gap-inner-gap mb-1"><div class="flex-1 min-w-0"><p class="font-label-sm text-label-sm text-primary truncate">Source: VS Code / main.js</p></div><span class="font-label-sm text-label-sm text-on-surface-variant shrink-0">13:31</span></div><div class="flex-1 min-w-0"><p class="font-mono-sm text-mono-sm text-on-background line-clamp-2 transition-all duration-300">!isAllowCTTContent(content) || !action.behavior?.is_tagged_condition</p></div><div class="flex justify-between items-center mt-2"><button class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1" onclick="const p = this.closest('.group').querySelector('p.text-on-background'); p.classList.toggle('line-clamp-2'); this.querySelector('span').textContent = p.classList.contains('line-clamp-2') ? 'expand_more' : 'expand_less'"><span class="material-symbols-outlined text-[18px]">expand_more</span><span class="text-label-sm">More</span></button><div class="flex items-center gap-4 transition-opacity absolute top-2 right-2"><button class="text-on-surface-variant hover:text-primary transition-colors" title="Copy"><span class="material-symbols-outlined text-[18px]">content_copy</span></button><button class="text-on-surface-variant hover:text-primary transition-colors" title="Favorite"><span class="material-symbols-outlined text-[18px]">star</span></button><button class="text-on-surface-variant hover:text-error transition-colors" title="Delete"><span class="material-symbols-outlined text-[18px]">delete</span></button></div></div></div>
<!-- Clipboard Item (Sudo command) -->
<div class="group relative flex flex-col p-item-padding bg-surface-container rounded-xl border border-transparent hover:border-outline-variant hover:bg-surface-container-high transition-all duration-200"><div class="flex justify-between items-start gap-inner-gap mb-1"><div class="flex-1 min-w-0"><p class="font-label-sm text-label-sm text-primary truncate">Source: Terminal / Bash</p></div><span class="font-label-sm text-label-sm text-on-surface-variant shrink-0">12:20</span></div><div class="flex-1 min-w-0"><p class="font-mono-sm text-mono-sm text-on-background line-clamp-2 transition-all duration-300">sudo apt install ~/Downloads/claude-desktop-linux</p></div><div class="flex justify-between items-center mt-2"><button class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1" onclick="const p = this.closest('.group').querySelector('p.text-on-background'); p.classList.toggle('line-clamp-2'); this.querySelector('span').textContent = p.classList.contains('line-clamp-2') ? 'expand_more' : 'expand_less'"><span class="material-symbols-outlined text-[18px]">expand_more</span><span class="text-label-sm">More</span></button><div class="flex items-center gap-4 transition-opacity absolute top-2 right-2"><button class="text-on-surface-variant hover:text-primary transition-colors" title="Copy"><span class="material-symbols-outlined text-[18px]">content_copy</span></button><button class="text-on-surface-variant hover:text-primary transition-colors" title="Favorite"><span class="material-symbols-outlined text-[18px]">star</span></button><button class="text-on-surface-variant hover:text-error transition-colors" title="Delete"><span class="material-symbols-outlined text-[18px]">delete</span></button></div></div></div>
</section>
<!-- Date Section -->
<section class="mt-4 space-y-inner-gap">
<div class="sticky top-0 py-2 bg-surface/90 glass-blur z-10 flex items-center justify-center">
<span class="font-label-lg text-label-lg text-on-surface-variant bg-surface-container px-3 py-0.5 rounded-full border border-outline-variant/30">Thursday, July 23, 2026</span>
</div>
<!-- Clipboard Item (Email) -->
<div class="group relative flex flex-col p-item-padding bg-surface-container rounded-xl border border-transparent hover:border-outline-variant hover:bg-surface-container-high transition-all duration-200">
<div class="flex justify-between items-start gap-inner-gap">
<div class="flex-1 min-w-0">
<p class="font-body-md text-body-md text-on-background truncate">subdano.hq@gmail.com</p>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant shrink-0">23:43</span>
</div>
<div class="flex items-center gap-4 transition-opacity absolute top-2 right-2"><button class="text-on-surface-variant hover:text-primary transition-colors" title="Copy"><span class="material-symbols-outlined text-[18px]">content_copy</span></button><button class="text-on-surface-variant hover:text-primary transition-colors" title="Favorite"><span class="material-symbols-outlined text-[18px]">star</span></button><button class="text-on-surface-variant hover:text-error transition-colors" title="Delete"><span class="material-symbols-outlined text-[18px]">delete</span></button></div>
</div>
<!-- Clipboard Item (Git URL) -->
<div class="group relative flex flex-col p-item-padding bg-surface-container rounded-xl border border-transparent hover:border-outline-variant hover:bg-surface-container-high transition-all duration-200">
<div class="flex justify-between items-start gap-inner-gap">
<div class="flex-1 min-w-0">
<p class="font-mono-sm text-mono-sm text-on-background truncate">git@git.qapint.com:ewizard/ewizard-v...</p>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant shrink-0">16:26</span>
</div>
<div class="flex items-center gap-4 transition-opacity absolute top-2 right-2"><button class="text-on-surface-variant hover:text-primary transition-colors" title="Copy"><span class="material-symbols-outlined text-[18px]">content_copy</span></button><button class="text-on-surface-variant hover:text-primary transition-colors" title="Favorite"><span class="material-symbols-outlined text-[18px]">star</span></button><button class="text-on-surface-variant hover:text-error transition-colors" title="Delete"><span class="material-symbols-outlined text-[18px]">delete</span></button></div>
</div>
<!-- Clipboard Item (Snippet) -->
<div class="group relative flex flex-col p-item-padding bg-surface-container rounded-xl border border-transparent hover:border-outline-variant hover:bg-surface-container-high transition-all duration-200">
<div class="flex justify-between items-start gap-inner-gap">
<div class="flex-1 min-w-0">
<p class="font-mono-sm text-mono-sm text-on-background line-clamp-1">_id: string; // ObjectId is_deleted: bool...</p>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant shrink-0">17:03</span>
</div>
<div class="flex items-center gap-4 transition-opacity absolute top-2 right-2"><button class="text-on-surface-variant hover:text-primary transition-colors" title="Copy"><span class="material-symbols-outlined text-[18px]">content_copy</span></button><button class="text-on-surface-variant hover:text-primary transition-colors" title="Favorite"><span class="material-symbols-outlined text-[18px]">star</span></button><button class="text-on-surface-variant hover:text-error transition-colors" title="Delete"><span class="material-symbols-outlined text-[18px]">delete</span></button></div>
</div>
</section>
</main>
<!-- BottomNavBar (JSON Instruction Applied) -->
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-2 bg-surface-container-high border-t border-outline-variant shadow-lg rounded-t-xl">
<!-- Active Navigation: Copied -->
<a class="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1 transition-transform duration-200 active:scale-90" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">content_paste</span>
<span class="font-label-sm text-label-sm">Copied</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-transform duration-200 active:scale-90" href="#">
<span class="material-symbols-outlined">edit_note</span>
<span class="font-label-sm text-label-sm">Custom</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-transform duration-200 active:scale-90" href="#">
<span class="material-symbols-outlined">star</span>
<span class="font-label-sm text-label-sm">Favorite</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-transform duration-200 active:scale-90" href="#">
<span class="material-symbols-outlined">history</span>
<span class="font-label-sm text-label-sm">Memory</span>
</a>
</nav>
<!-- FAB (Contextual for Clipboard Screens) -->

</div>
<!-- Micro-interactions Script -->
<script>
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('nav a').forEach(l => {
                    l.classList.remove('bg-secondary-container', 'text-on-secondary-container', 'rounded-full', 'px-4', 'py-1');
                    l.classList.add('text-on-surface-variant');
                    l.querySelector('span.material-symbols-outlined').style.fontVariationSettings = "'FILL' 0";
                });
                link.classList.add('bg-secondary-container', 'text-on-secondary-container', 'rounded-full', 'px-4', 'py-1');
                link.classList.remove('text-on-surface-variant');
                link.querySelector('span.material-symbols-outlined').style.fontVariationSettings = "'FILL' 1";
            });
        });

        // Simple Toast for Copy Action
        document.querySelectorAll('button:has(.material-symbols-outlined:contains("content_paste"))').forEach(btn => {
           btn.addEventListener('click', () => {
              console.log('Copied to clipboard');
              // Logic for visual feedback could go here
           });
        });
    </script>


</body></html>

2) favorite tab exampl 
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>ClipFlow - Favorite Items</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@400&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "primary-container": "#2dd4bf",
                        "on-tertiary-container": "#744000",
                        "on-secondary": "#00315d",
                        "tertiary-container": "#ffac5a",
                        "background": "#0b1326",
                        "on-primary-container": "#00574d",
                        "error-container": "#93000a",
                        "on-tertiary-fixed": "#2d1600",
                        "secondary-container": "#0267b8",
                        "outline-variant": "#3c4a46",
                        "tertiary": "#ffd1aa",
                        "on-surface-variant": "#bacac5",
                        "inverse-surface": "#dae2fd",
                        "inverse-primary": "#006b5f",
                        "secondary": "#a4c9ff",
                        "on-tertiary": "#4b2800",
                        "surface": "#0b1326",
                        "on-primary": "#003731",
                        "on-error-container": "#ffdad6",
                        "surface-container-highest": "#2d3449",
                        "primary-fixed": "#62fae3",
                        "surface-container-high": "#222a3d",
                        "surface-bright": "#31394d",
                        "secondary-fixed-dim": "#a4c9ff",
                        "surface-container": "#171f33",
                        "inverse-on-surface": "#283044",
                        "tertiary-fixed-dim": "#ffb875",
                        "outline": "#859490",
                        "on-tertiary-fixed-variant": "#6b3b00",
                        "on-secondary-fixed": "#001c39",
                        "on-primary-fixed": "#00201c",
                        "on-error": "#690005",
                        "error": "#ffb4ab",
                        "secondary-fixed": "#d4e3ff",
                        "surface-variant": "#2d3449",
                        "surface-container-low": "#131b2e",
                        "on-secondary-fixed-variant": "#004883",
                        "primary-fixed-dim": "#3cddc7",
                        "surface-container-lowest": "#060e20",
                        "on-primary-fixed-variant": "#005047",
                        "tertiary-fixed": "#ffdcc0",
                        "surface-dim": "#0b1326",
                        "surface-tint": "#3cddc7",
                        "primary": "#57f1db",
                        "on-secondary-container": "#d6e5ff",
                        "on-surface": "#dae2fd",
                        "on-background": "#dae2fd"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "item-padding": "0.875rem",
                        "inner-gap": "0.5rem",
                        "stack-gap": "0.75rem",
                        "container-padding": "1rem"
                    },
                    "fontFamily": {
                        "headline-md": ["Inter"],
                        "mono-sm": ["JetBrains Mono"],
                        "label-sm": ["Inter"],
                        "body-md": ["Inter"],
                        "body-sm": ["Inter"],
                        "label-lg": ["Inter"]
                    },
                    "fontSize": {
                        "headline-md": ["18px", {"lineHeight": "24px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                        "mono-sm": ["12px", {"lineHeight": "16px", "fontWeight": "400"}],
                        "label-sm": ["11px", {"lineHeight": "14px", "fontWeight": "500"}],
                        "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "body-sm": ["13px", {"lineHeight": "18px", "fontWeight": "400"}],
                        "label-lg": ["12px", {"lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "600"}]
                    }
                },
            },
        }
    </script>
<style>
        body {
            background-color: #0b1326;
            color: #dae2fd;
            -webkit-font-smoothing: antialiased;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #1e293b;
            border-radius: 10px;
        }
        .card-pinned {
            border-left: 3px solid #ef4444;
        }
        .glass-blur {
            backdrop-filter: blur(8px);
            background: rgba(11, 19, 38, 0.8);
        }
    </style>
</head>
<body class="font-body-md text-body-md selection:bg-primary/30 selection:text-primary">
<!-- Top App Bar -->
<header class="w-full top-0 sticky z-50 flex items-center justify-between px-container-padding h-14 bg-background dark:bg-background">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary" data-icon="content_paste">content_paste</span>
<h1 class="font-headline-md text-headline-md font-bold text-primary">ClipFlow</h1>
</div>
<div class="flex items-center gap-2">
<button class="p-2 rounded-full hover:bg-surface-container dark:hover:bg-surface-container transition-colors active:scale-95 transition-transform">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="search">search</span>
</button>
<button class="p-2 rounded-full hover:bg-surface-container dark:hover:bg-surface-container transition-colors active:scale-95 transition-transform">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="more_vert">more_vert</span>
</button>
</div>
</header>
<main class="pb-24 px-container-padding space-y-stack-gap max-w-[400px] mx-auto min-h-screen">
<!-- Header Section -->
<div class="pt-4 pb-2">
<h2 class="font-headline-md text-headline-md text-on-surface">Favorite Clips</h2>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Your most valuable stored data</p>
</div>
<!-- Date Header: Pinned -->
<div class="mt-4 mb-2 flex items-center gap-2">
<span class="font-label-lg text-label-lg text-primary uppercase tracking-wider">Pinned Items</span>
<div class="h-[1px] flex-grow bg-outline-variant"></div>
</div>
<!-- Pinned Clipboard Card 1 -->
<div class="group relative bg-surface-container-high rounded-lg overflow-hidden card-pinned transition-all duration-300 hover:bg-surface-container-highest">
<div class="p-item-padding">
<div class="flex justify-between items-start mb-2">
<div class="flex items-center gap-2 max-w-[70%]">
<span class="material-symbols-outlined text-on-surface-variant text-[16px]" data-icon="language">language</span>
<span class="font-mono-sm text-mono-sm text-on-surface-variant truncate">https://gemini.google.com/app/...</span>
</div>
<div class="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
<button class="p-1.5 rounded-full hover:bg-primary-container/20 text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined" data-icon="push_pin" style="font-variation-settings: 'FILL' 1;">push_pin</span>
</button>
<button class="p-1.5 rounded-full hover:bg-primary-container/20 text-primary transition-colors">
<span class="material-symbols-outlined" data-icon="star" style="font-variation-settings: 'FILL' 1;">star</span>
</button>
</div>
</div>
<p class="font-body-sm text-body-sm text-on-surface line-clamp-3">
                    Prompt: Design a high-end clipboard manager UI using Slate and Teal colors. Focus on high density, dark mode, and corporate modern aesthetic for power users.
                </p>
<div class="flex justify-end gap-2 mt-3 pt-2 border-t border-outline-variant/30">
<button class="flex items-center gap-1.5 px-2 py-1 rounded text-primary hover:bg-primary-container/10 transition-colors active:scale-95">
<span class="material-symbols-outlined text-[18px]" data-icon="content_copy">content_copy</span>
<span class="font-label-sm text-label-sm">Copy</span>
</button>
<button class="p-1.5 text-on-surface-variant hover:text-error transition-colors">
<span class="material-symbols-outlined text-[18px]" data-icon="delete">delete</span>
</button>
</div>
</div>
</div>
<!-- Pinned Clipboard Card 2 (Code Snippet) -->
<div class="group relative bg-surface-container-high rounded-lg overflow-hidden card-pinned transition-all duration-300 hover:bg-surface-container-highest">
<div class="p-item-padding">
<div class="flex justify-between items-start mb-2">
<div class="flex items-center gap-2 max-w-[70%]">
<span class="material-symbols-outlined text-on-surface-variant text-[16px]" data-icon="code">code</span>
<span class="font-mono-sm text-mono-sm text-on-surface-variant truncate">VS Code / tailwind.config.js</span>
</div>
<div class="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
<button class="p-1.5 rounded-full hover:bg-primary-container/20 text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined" data-icon="push_pin" style="font-variation-settings: 'FILL' 1;">push_pin</span>
</button>
<button class="p-1.5 rounded-full hover:bg-primary-container/20 text-primary transition-colors">
<span class="material-symbols-outlined" data-icon="star" style="font-variation-settings: 'FILL' 1;">star</span>
</button>
</div>
</div>
<div class="font-mono-sm text-mono-sm text-on-surface bg-surface-container-lowest p-2 rounded border border-outline-variant/20 mb-1 line-clamp-3">
                    colors: {
                        primary: "#57f1db",
                        surface: "#0b1326",
                        "primary-container": "#2dd4bf"
                    }
                </div>
<div class="flex justify-end gap-2 mt-3 pt-2 border-t border-outline-variant/30">
<button class="flex items-center gap-1.5 px-2 py-1 rounded text-primary hover:bg-primary-container/10 transition-colors active:scale-95">
<span class="material-symbols-outlined text-[18px]" data-icon="content_copy">content_copy</span>
<span class="font-label-sm text-label-sm">Copy</span>
</button>
<button class="p-1.5 text-on-surface-variant hover:text-error transition-colors">
<span class="material-symbols-outlined text-[18px]" data-icon="delete">delete</span>
</button>
</div>
</div>
</div>
<!-- Date Header: Favorites -->
<div class="mt-8 mb-2 flex items-center gap-2">
<span class="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Favorited Today</span>
<div class="h-[1px] flex-grow bg-outline-variant"></div>
</div>
<!-- Standard Favorite Card 1 -->
<div class="group relative bg-surface-container rounded-lg overflow-hidden border border-transparent hover:border-outline-variant/40 transition-all duration-300">
<div class="p-item-padding">
<div class="flex justify-between items-start mb-2">
<div class="flex items-center gap-2 max-w-[70%]">
<span class="material-symbols-outlined text-on-surface-variant text-[16px]" data-icon="description">description</span>
<span class="font-mono-sm text-mono-sm text-on-surface-variant truncate">Notes / Project Alpha</span>
</div>
<div class="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
<button class="p-1.5 rounded-full hover:bg-primary-container/20 text-on-surface-variant transition-colors">
<span class="material-symbols-outlined" data-icon="push_pin">push_pin</span>
</button>
<button class="p-1.5 rounded-full hover:bg-primary-container/20 text-primary transition-colors">
<span class="material-symbols-outlined" data-icon="star" style="font-variation-settings: 'FILL' 1;">star</span>
</button>
</div>
</div>
<p class="font-body-sm text-body-sm text-on-surface line-clamp-2">
                    Action items from meeting: finalize API endpoints, review security protocols, and sync with the dev-ops team.
                </p>
<div class="flex justify-end gap-2 mt-3 pt-2 border-t border-outline-variant/30">
<button class="flex items-center gap-1.5 px-2 py-1 rounded text-primary hover:bg-primary-container/10 transition-colors active:scale-95">
<span class="material-symbols-outlined text-[18px]" data-icon="content_copy">content_copy</span>
<span class="font-label-sm text-label-sm">Copy</span>
</button>
<button class="p-1.5 text-on-surface-variant hover:text-error transition-colors">
<span class="material-symbols-outlined text-[18px]" data-icon="delete">delete</span>
</button>
</div>
</div>
</div>
<!-- Image Reference Card -->
<div class="group relative bg-surface-container rounded-lg overflow-hidden border border-transparent hover:border-outline-variant/40 transition-all duration-300">
<div class="p-item-padding">
<div class="flex justify-between items-start mb-2">
<div class="flex items-center gap-2 max-w-[70%]">
<span class="material-symbols-outlined text-on-surface-variant text-[16px]" data-icon="image">image</span>
<span class="font-mono-sm text-mono-sm text-on-surface-variant truncate">Reference Image</span>
</div>
<div class="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
<button class="p-1.5 rounded-full hover:bg-primary-container/20 text-on-surface-variant transition-colors">
<span class="material-symbols-outlined" data-icon="push_pin">push_pin</span>
</button>
<button class="p-1.5 rounded-full hover:bg-primary-container/20 text-primary transition-colors">
<span class="material-symbols-outlined" data-icon="star" style="font-variation-settings: 'FILL' 1;">star</span>
</button>
</div>
</div>
<div class="flex gap-3">
<div class="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-surface-container-highest">
<img alt="Image of UI design reference" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNMHmHHe-yyc2roWq1x4BqYHwbhfLYXSzP01bMJFbxKx57X_2r6RXsKk-0mMmScrJ4Ks3tNjtePUp_3WH0GWWQUzO1RsgSL2rHEpoGmhOpNK0CydoIuQSikV4cZ51ymLCPrVmqsIUsDg95bMVYmvvywoqQYsdU1gXxRPXgVyQDpycOPwsYFkwHX7XMkmHYjLmqGjCdwIioBKjIMEe1poyo9eR3BduIRgWPl17NemV2vKut-LSeFJ0_60ZQRbiWL7ixmj4vqUfc2ezG"/>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 italic">
                        Design reference image saved for color matching and layout flow. Slate/Teal palette confirmed.
                    </p>
</div>
<div class="flex justify-end gap-2 mt-3 pt-2 border-t border-outline-variant/30">
<button class="flex items-center gap-1.5 px-2 py-1 rounded text-primary hover:bg-primary-container/10 transition-colors active:scale-95">
<span class="material-symbols-outlined text-[18px]" data-icon="content_copy">content_copy</span>
<span class="font-label-sm text-label-sm">Copy Link</span>
</button>
<button class="p-1.5 text-on-surface-variant hover:text-error transition-colors">
<span class="material-symbols-outlined text-[18px]" data-icon="delete">delete</span>
</button>
</div>
</div>
</div>
<!-- Date Header: Yesterday -->
<div class="mt-8 mb-2 flex items-center gap-2">
<span class="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Older Favorites</span>
<div class="h-[1px] flex-grow bg-outline-variant"></div>
</div>
<!-- Standard Favorite Card 2 -->
<div class="group relative bg-surface-container rounded-lg overflow-hidden border border-transparent hover:border-outline-variant/40 transition-all duration-300">
<div class="p-item-padding">
<div class="flex justify-between items-start mb-2">
<div class="flex items-center gap-2 max-w-[70%]">
<span class="material-symbols-outlined text-on-surface-variant text-[16px]" data-icon="terminal">terminal</span>
<span class="font-mono-sm text-mono-sm text-on-surface-variant truncate">iTerm2 / ssh-key-gen</span>
</div>
<div class="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
<button class="p-1.5 rounded-full hover:bg-primary-container/20 text-on-surface-variant transition-colors">
<span class="material-symbols-outlined" data-icon="push_pin">push_pin</span>
</button>
<button class="p-1.5 rounded-full hover:bg-primary-container/20 text-primary transition-colors">
<span class="material-symbols-outlined" data-icon="star" style="font-variation-settings: 'FILL' 1;">star</span>
</button>
</div>
</div>
<p class="font-mono-sm text-mono-sm text-on-surface bg-surface-container-lowest p-2 rounded border border-outline-variant/20 truncate">
                    ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC8z9...
                </p>
<div class="flex justify-end gap-2 mt-3 pt-2 border-t border-outline-variant/30">
<button class="flex items-center gap-1.5 px-2 py-1 rounded text-primary hover:bg-primary-container/10 transition-colors active:scale-95">
<span class="material-symbols-outlined text-[18px]" data-icon="content_copy">content_copy</span>
<span class="font-label-sm text-label-sm">Copy</span>
</button>
<button class="p-1.5 text-on-surface-variant hover:text-error transition-colors">
<span class="material-symbols-outlined text-[18px]" data-icon="delete">delete</span>
</button>
</div>
</div>
</div>
</main>
<!-- Bottom Nav Bar -->
<nav class="fixed bottom-0 left-0 w-full flex justify-around items-center bg-surface-container dark:bg-surface-container py-2 border-t border-outline-variant dark:border-outline-variant z-50">
<button class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-4 py-1 hover:text-primary dark:hover:text-primary transition-all active:scale-90 duration-200">
<span class="material-symbols-outlined" data-icon="history">history</span>
<span class="font-label-sm text-label-sm">Copied</span>
</button>
<button class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-4 py-1 hover:text-primary dark:hover:text-primary transition-all active:scale-90 duration-200">
<span class="material-symbols-outlined" data-icon="edit_note">edit_note</span>
<span class="font-label-sm text-label-sm">Custom</span>
</button>
<button class="flex flex-col items-center justify-center bg-primary-container dark:bg-primary-container text-on-primary-container dark:text-on-primary-container rounded-full px-4 py-1 active:scale-90 transition-transform duration-200">
<span class="material-symbols-outlined" data-icon="star" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="font-label-sm text-label-sm">Favorite</span>
</button>
<button class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-4 py-1 hover:text-primary dark:hover:text-primary transition-all active:scale-90 duration-200">
<span class="material-symbols-outlined" data-icon="psychology">psychology</span>
<span class="font-label-sm text-label-sm">Memory</span>
</button>
</nav>
<!-- Micro-interaction Script -->
<script>
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                button.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    </script>
</body></html>

</HTML_PROTOTYPE>

### YOUR TASK & STRICT CONSTRAINTS:

1. **NO CSP VIOLATIONS (Manifest V3):** Do NOT include any external CDN links (Google Fonts, Tailwind CDN, external Material Symbols scripts/stylesheets). Assume all icons and fonts are handled locally or via UnoCSS icons preset (`i-material-symbols-...` or similar, or local font classes).
2. **UnoCSS Integration:** Extract the custom color palette (`primary`, `surface`, `surface-container-high`, etc.), typography, and custom spacing from the HTML prototype's `tailwind.config` script and show me exactly how to update my `unocss.config.ts` and theme definitions to support them.
3. **Component Refactoring (Do not build a monolithic file):**
   - Refactor and split the UI update into my existing Vue 3 (<script setup lang="ts">) architecture.
   - Map the card item design to `PopupContentListItem.vue`.
   - Map the header/top-bar to `PopupContentHeader.vue`.
   - Map the form screen to `PopupContentCustomCreateItem.vue`.
4. **Preserve Logic:** DO NOT alter, invent, or mock any business logic, storage calls, or state management. Focus strictly on the template, UI bindings, structural classes, and animations/micro-interactions (like the hover states and ripple effects, adapted for Vue).
5. **High Density & Scroll Optimization:** Ensure the main content area handles overflow correctly without hiding items behind the fixed bottom navbar or top header.

### DELIVERABLES REQUIRED:
1. Updated `unocss.config.ts` (with the new design system tokens).
2. Code for `PopupContentListItem.vue` supporting all card variations seen in the screenshots (standard text, code snippet with preview, image reference card, pinned state). Use Vue props/conditionals for these states.
3. Code for `PopupContentCustomCreateItem.vue` based on Screenshot #2.
4. Code for the Navigation / Layout wrapper implementing the fixed top bar and bottom navbar cleanly.

Do not write generic advice or meta-commentary. Provide production-ready Vue 3 / UnoCSS code diffs and implementations directly.

-----------
### DESIGN 

name: Slate & Teal Utility
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bacac5'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#859490'
  outline-variant: '#3c4a46'
  surface-tint: '#3cddc7'
  primary: '#57f1db'
  on-primary: '#003731'
  primary-container: '#2dd4bf'
  on-primary-container: '#00574d'
  inverse-primary: '#006b5f'
  secondary: '#a4c9ff'
  on-secondary: '#00315d'
  secondary-container: '#0267b8'
  on-secondary-container: '#d6e5ff'
  tertiary: '#ffd1aa'
  on-tertiary: '#4b2800'
  tertiary-container: '#ffac5a'
  on-tertiary-container: '#744000'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#62fae3'
  primary-fixed-dim: '#3cddc7'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005047'
  secondary-fixed: '#d4e3ff'
  secondary-fixed-dim: '#a4c9ff'
  on-secondary-fixed: '#001c39'
  on-secondary-fixed-variant: '#004883'
  tertiary-fixed: '#ffdcc0'
  tertiary-fixed-dim: '#ffb875'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6b3b00'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-padding: 1rem
  stack-gap: 0.75rem
  item-padding: 0.875rem
  inner-gap: 0.5rem
---

## Brand & Style
The design system transitions from a high-friction, harsh aesthetic to a **Corporate / Modern** aesthetic with a **Soft Dark** focus. The primary goal is to reduce ocular fatigue for power users who interact with clipboard data throughout the day. 

The personality is efficient, technical, and dependable. It utilizes a deep slate and navy base to provide a stable foundation, contrasted with soft teal accents that guide the eye without overwhelming it. The style relies on **Minimalism** and **Subtle Elevation**, moving away from harsh outlines in favor of tonal layering and soft shadows to communicate hierarchy.

## Colors
The palette is built on a "Soft Dark" foundation to eliminate the eye strain caused by pure black or high-contrast yellow. 

- **Primary (Teal):** Used for actionable items, confirmations, and active states. It provides high legibility against the dark background.
- **Secondary (Soft Blue):** Used for informational accents and secondary interactive elements like chips or tags.
- **Neutrals (Slate/Navy):** A range of cool greys and navies create the "Soft Dark" environment. The background utilizes a deep slate to prevent the "floating text" effect found in pure black themes.
- **Semantic Colors:** Success (Green), Warning (Amber), and Error (Red) should be used sparingly in desaturated tones to maintain the calm atmosphere.

## Typography
This design system uses **Inter** for its exceptional legibility in small-scale UI environments like Chrome extensions. 

- **Hierarchy:** Headlines are kept modest in size to maximize space for content. 
- **Content:** Clipboard items use `body-md` for primary text. For code snippets or technical records, a secondary monospaced font (**JetBrains Mono**) is recommended for the content area only.
- **Metadata:** Use `label-sm` in an uppercase style for timestamps and categories to distinguish them clearly from the primary record data.

## Layout & Spacing
The layout follows a **Fixed Grid** model tailored for a standard Chrome extension width (typically 360px to 400px). 

- **Density:** The design maintains a "Compact but Airy" rhythm. Elements are spaced using an 8px (0.5rem) base unit.
- **Reflow:** As a small-footprint tool, the layout is single-column. Vertical scrolling is the primary interaction.
- **Sectioning:** Use explicit "Date Headers" to break up long lists of clipboard items, providing a 16px top margin for each new group to establish clear temporal breaks.

## Elevation & Depth
Hierarchy is achieved through **Tonal Layers** rather than shadows. 

- **Level 0 (Base):** The main background (`#0F172A`).
- **Level 1 (Cards):** Clipboard items and cards use a slightly lighter slate (`#1E293B`) to sit "above" the background.
- **Level 2 (Active/Hover):** On hover or selection, cards use a subtle highlight border or a third-tier background (`#334155`).
- **Overlays:** Modals for "Create Custom Record" use a soft background blur (backdrop-filter: blur(8px)) to focus the user's attention while maintaining context of the list beneath.

## Shapes
The shape language is consistently **Rounded** to evoke a modern, professional software feel. 

- **Cards & Containers:** Use `10px` or `12px` (rounded-lg) for the main clipboard items. 
- **Inputs & Buttons:** Use `8px` (standard rounded) to maintain a cohesive look.
- **Chips:** Categories or tags should use the `pill` style (fully rounded) to differentiate them from functional buttons.

## Components

### Clipboard Cards
Cards should be borderless by default, using tonal difference to define their area. On hover, apply a subtle 1px border of `border_subtle`. The right side of the card should house quick-action icons (copy, pin, delete) that appear at 50% opacity and shift to 100% on hover.

### Inputs
Search bars and text fields should have a background color one shade darker or lighter than their container to ensure they look "inset." Use a teal `2px` bottom border or a full teal ring only when the field is focused.

### Tabs
The navigation tabs (Copied, Custom, Favorite) should use a "pill" highlight for the active state rather than a simple underline. This provides a larger target area and a more modern feel.

### Buttons
- **Primary:** Teal background with dark navy text for maximum contrast.
- **Secondary:** Transparent background with a `1px` teal border.
- **Ghost:** No background or border; uses teal text. Reserved for low-priority actions in headers.

### Custom Records
The creation form should prioritize vertical stack alignment. Each field should have a clear label in `label-sm` placed above the input, not as a placeholder, to ensure accessibility.

--------------------

# folder with design and image /home/rokkart/WORK/HOME_MADE/CHROME_EXTENSIONS/designs