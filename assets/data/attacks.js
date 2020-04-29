"use strict";

var Attacks = (function() { 

var data = 
{"BaitAndSwitch":{"name":"BaitAndSwitch","type":"attack","category":"economy","special":"opp-loses-1-turn","description":"Steal a turn from your opponent","staminaCost":"0.1","accuracy":"1","crtChance":"0.1","oppHealth":"0.2","oppAcc":"0.15"},"LootBox":{"name":"LootBox","type":"attack","category":"economy","description":"This attack is banned in some countries","staminaCost":"0.1","accuracy":"0.8","crtChance":"0.2","oppHealth":"0.15","oppAcc":"0.2"},"MicroTransaction":{"name":"MicroTransaction","type":"attack","category":"economy","description":"Nickle and dime the opponent","staminaCost":"0.05","accuracy":"1","oppHealth":"0.15","oppDef":"0.1","oppAtk":"0.1","oppAcc":"0.1","oppEva":"0.1"},"ConfirmShaming":{"name":"ConfirmShaming","type":"attack","category":"economy","description":"Shame the monster into compliance","staminaCost":"0.12","accuracy":"1","crtChance":"0.1","oppHealth":"0.15","oppEva":"0.2"},"PayToWin":{"name":"PayToWin","type":"defense","category":"economy","description":"Not all games have to be this way","staminaCost":"0.15","accuracy":"1","selfHealth":"1.1","selfAtk":"0.2"},"DarkPattern":{"name":"DarkPattern","type":"defense","category":"economy","description":"A devious technique to trick the monster","staminaCost":"0.1","accuracy":"1","crtChance":"0.1","selfHealth":"1.1","selfAcc":"1.25","selfEva":"1.1"},"HiddenCosts":{"name":"HiddenCosts","type":"defense","category":"economy","special":"opp-loses-2-turns","description":"Always beware fine print","staminaCost":"0.1","accuracy":"1","crtChance":"0.1","selfHealth":"1.05","selfAcc":"1.2","selfEva":"1.15"},"MegaByte":{"name":"MegaByte","type":"attack","category":"computer","animation-name":"attack-computer.gif","sound":"computer-megabyte.wav","description":"256 levels of chomp","staminaCost":"0.2","accuracy":"1","crtChance":"0.1","oppHealth":"0.4","damageOTChance":"0.25","damageOverTime":"0.3","turns":"2"},"BitBolt":{"name":"BitBolt","type":"attack","category":"computer","animation-name":"attack-computer.gif","sound":"computer-megabyte.wav","description":"Beware the power of 2","staminaCost":"0.1","accuracy":"0.9","crtChance":"0.1","oppHealth":"0.2"},"LowBattery":{"name":"LowBattery","type":"attack","category":"computer","sound":"computer-lowbattery.wav","special":"opp-loses-2-turns","description":"Steal two turns from your opponent!","staminaCost":"0.1","accuracy":"1","oppHealth":"0.1","oppDef":"0.1","oppAcc":"0.1"},"DriverUpdate":{"name":"DriverUpdate","type":"defense","category":"computer","animation-name":"defense-computer.gif","sound":"computer-reboot.wav","description":"We can patch it after launch","staminaCost":"0.1","accuracy":"1","selfHealth":"1.1","selfDef":"1.1","selfAcc":"1.2"},"Reboot":{"name":"Reboot","type":"defense","category":"computer","animation-name":"defense-computer.gif","sound":"computer-reboot.wav","description":"Have you tried turning it off and back on again?","staminaCost":"0.18","accuracy":"1","selfHealth":"1.5"},"CryptCracker":{"name":"CryptCracker","type":"attack","category":"cryptography","animation-name":"attack-cryptography-cryptcracker.gif","sound":"cryptography-cryptcracker.wav","description":"Damaging attack that breaks open secrets","staminaCost":"0.1","accuracy":"0.85","crtChance":"0.1","oppHealth":"0.25"},"CryptoSlam":{"name":"CryptoSlam","type":"attack","category":"cryptography","description":"Can't find me now","staminaCost":"0.1","oppHealth":"0.2","oppAcc":"0.2"},"Triangulate":{"name":"Triangulate","type":"attack","category":"cryptography","animation-name":"attack-cryptography-triangulate.gif","description":"Keep them on the line for one minute","staminaCost":"0.1","accuracy":"0.95","crtChance":"0.1","oppHealth":"0.2","oppEva":"0.25"},"AlgoRhythm":{"name":"AlgoRhythm","type":"defense","category":"cryptography","sound":"cryptography-algorhythm.wav","special":"qte","description":"Feel the beat!","staminaCost":"0.15","accuracy":"1","crtChance":"0.1","selfHealth":"1.1"},"Overcompress":{"name":"Overcompress","type":"attack","category":"data","animation ideas":"make them smaller temporarily","description":"Ugh, this image is all fuzzy!","staminaCost":"0.12","accuracy":"0.8","crtChance":"0.1","oppHealth":"0.2"},"CorruptDrive":{"name":"CorruptDrive","type":"attack","category":"data","throw":"true","description":"Should've backed up","staminaCost":"0.1","accuracy":"1","crtChance":"0.1","oppHealth":"0.3","confuseChance":"0.75"},"DataCorruption":{"name":"DataCorruption","type":"attack","category":"data","throw":"true","description":"Take down their defenses","staminaCost":"0.12","accuracy":"0.85","crtChance":"0.1","oppHealth":"0.15","oppDef":"0.3"},"CyberOptimize":{"name":"CyberOptimize","type":"defense","category":"data","description":"Heals in log(n) time","staminaCost":"0.15","accuracy":"1","crtChance":"0.3","selfHealth":"1.2","selfAcc":"1.25","selfEva":"1.15"},"UserError":{"name":"UserError","type":"attack","category":"error","description":"99% of the time","staminaCost":"0.12","accuracy":"1","crtChance":"0.2","oppHealth":"0.25"},"BannerOverload":{"name":"BannerOverload","type":"attack","category":"error","description":"No I don't want to buy a Lexus! I want to watch a YouTube video!","staminaCost":"0.15","accuracy":"0.95","crtChance":"0.1","oppHealth":"0.3"},"PacketLoss":{"name":"PacketLoss","type":"attack","category":"error","description":"Can't hit what you can't load","staminaCost":"0.1","accuracy":"1","crtChance":"0.1","oppHealth":"0.2","oppAtk":"0.25"},"BleedingEdge":{"name":"BleedingEdge","type":"attack","category":"error","description":"So advanced, it's basically magic","staminaCost":"0.15","accuracy":"0.95","crtChance":"0.4","oppHealth":"0.2"},"BugFix":{"name":"BugFix","type":"defense","category":"error","description":"Every programmer's worst nightmare","staminaCost":"0.15","accuracy":"1","selfHealth":"1.3","selfDef":"1.2"},"RandomAccess":{"name":"RandomAccess","type":"attack","category":"memory","animation ideas":"slot machine to determine which attack","description":"Spin to Win","staminaCost":"0.18","accuracy":"0.95","crtChance":"0.1","oppHealth":"0.2","oppDef":"0.2"},"RAMHog":{"name":"RAMHog","type":"attack","category":"memory","description":"Looking at you, Chrome","staminaCost":"0.15","accuracy":"0.9","crtChance":"0.1","oppHealth":"0.25","oppEva":"0.3"},"MemoryFlare":{"name":"MemoryFlare","type":"attack","category":"memory","animation-name":"attack-memory-memoryflare.gif","sound":"memory-memoryflare.wav","description":"Why is my computer so hot?","staminaCost":"0.1","accuracy":"1","oppHealth":"0.3","oppAtk":"0.25"},"CacheErase":{"name":"CacheErase","type":"defense","category":"memory","description":"No one wants to see that","staminaCost":"0.2","accuracy":"1","selfHealth":"1.2","selfEva":"1.25"},"TraceRoute":{"name":"TraceRoute","type":"attack","category":"network","description":"\"Did you try to log in from [Asgabat, Turkmenistan]?\"","staminaCost":"0.1","accuracy":"1","crtChance":"0.1","oppHealth":"0.2","oppAcc":"0.2","damageOTChance":"0.85","damageOverTime":"0.2","turns":"2"},"SlowConnection":{"name":"SlowConnection","type":"attack","category":"network","animation-name":"attack-network-slowconnection.gif","sound":"network-connection.wav","description":"LAAAAAAG... OH GOD THE LAG","staminaCost":"0.1","accuracy":"0.9","crtChance":"0.1","oppHealth":"0.2","oppAcc":"0.3"},"OMGDDOS":{"name":"OMGDDOS","type":"attack","category":"network","description":"ROTFLMAO","staminaCost":"0.18","accuracy":"1","crtChance":"0.1","oppHealth":"0.2"},"DomainSwipe":{"name":"DomainSwipe","type":"defense","category":"network","animation-name":"defense-network-domainswipe.gif","sound":"network-domainswipe.wav","description":"Dang, someone registered it before me!","staminaCost":"0.15","accuracy":"1","selfAcc":"1.2"},"EnableVPN":{"name":"EnableVPN","type":"defense","category":"network","special":"lock","description":"I am from Australia for as long as it takes to watch this movie","staminaCost":"0.1","accuracy":"1","selfDef":"1.2","turns":"3"},"PacketShield":{"name":"PacketShield","type":"defense","category":"network","animation-name":"defense-network-packetshield.gif","description":"Won't lose these!","staminaCost":"0.1","accuracy":"1","selfDef":"1.1","selfEva":"1.2","turns":"3"},"AttachTracker":{"name":"AttachTracker","type":"attack","category":"security","animation-name":"attack-security-attachtracker.gif","sound":"security-attachtracker.wav","animation ideas":"like a parasite","description":"Only villains do that","staminaCost":"0.1","accuracy":"0.9","crtChance":"0.1","oppHealth":"0.2","oppDef":"0.2","damageOTChance":"0.7","damageOverTime":"0.2","turns":"2"},"ViralInfection":{"name":"ViralInfection","type":"attack","category":"security","animation-name":"attack-security-viralinfection.gif","description":"6 feet apart","staminaCost":"0.15","accuracy":"1","crtChance":"0.1","oppHealth":"0.2","oppEva":"0.25","damageOTChance":"1","damageOverTime":"0.3","turns":"3"},"GoPhish":{"name":"GoPhish","type":"attack","category":"security","animation-name":"attack-security-gophish.gif","sound":"security-gophish.wav","sound-delay":"300","special":"qte","description":"Do you have any two's?","staminaCost":"0.12","accuracy":"1","crtChance":"0.1","oppHealth":"0.25"},"IdentityTheft":{"name":"IdentityTheft","type":"attack","category":"security","special":"opp-loses-2-turns","description":"Steal two turns from your opponent!","staminaCost":"0.2","accuracy":"0.9","crtChance":"0.1","oppHealth":"0.1","oppAcc":"0.1"},"Spambush":{"name":"Spambush","type":"attack","category":"security","description":"Check the box to sign up for our newsletter","staminaCost":"0.15","accuracy":"0.8","crtChance":"0.1","oppHealth":"0.2","oppEva":"0.25"},"Firewall":{"name":"Firewall","type":"defense","category":"security","animation-name":"defense-security-firewall.gif","sound":"security-firewall.wav","description":"Health and Defense","staminaCost":"0.15","accuracy":"1","selfHealth":"1.1","selfDef":"1.2"},"DenyAccess":{"name":"DenyAccess","type":"defense","category":"security","special":"opp-loses-1-turn","description":"Steal a turn from your opponent","staminaCost":"0.2","accuracy":"1","selfDef":"1.15"},"FilterBurn":{"name":"FilterBurn","type":"defense","category":"security","description":"Burn it all down","staminaCost":"0.15","accuracy":"1","selfEva":"1.2"},"TagCurse":{"name":"TagCurse","type":"attack","category":"social","animation-name":"attack-social-tagcurse.gif","sound":"social-tagcurse.wav","description":"Don't fall prey to the curse of the influencers!","staminaCost":"0.1","accuracy":"0.8","crtChance":"0.1","oppHealth":"0.2","oppDef":"0.25"},"EmailBlitz":{"name":"EmailBlitz","type":"attack","category":"social","animation-name":"attack-social-emailblitz.gif","sound":"social-emailblitz.wav","description":"Hi, would you like to vote for _______?","staminaCost":"0.18","accuracy":"0.8","crtChance":"0.1","oppHealth":"0.3","damageOTChance":"0.25","damageOverTime":"0.1","turns":"2"},"ClickStrike":{"name":"ClickStrike","type":"attack","category":"social","animation-name":"attack-social-clickstrike.gif","sound":"social-clickstrike.wav","description":"Basic attack, does damage, you know how it goes","staminaCost":"0.15","accuracy":"0.95","crtChance":"0.1","oppHealth":"0.15"},"PrivacyLeech":{"name":"PrivacyLeech","type":"attack","category":"social","animation-name":"attack-social-privacyleech.gif","special":"opp-loses-1-turn","description":"Steal a turn from your opponent","staminaCost":"0.15","accuracy":"1","crtChance":"0.1","oppHealth":"0.15","oppDef":"0.1"},"Klomper":{"name":"Klomper","type":"attack","category":"social","animation-name":"attack-social-klomper.gif","special":"opp-loses-2-turns","description":"Steal two turns! Oh, you gotta download Klomper","staminaCost":"0.15","accuracy":"1","crtChance":"0.1","oppHealth":"0.15","oppDef":"0.1"},"CrowdReach":{"name":"CrowdReach","type":"defense","category":"social","animation-name":"defense-social-crowdreach.gif","sound":"social-crowdreach.wav","description":"This video is sponsored by Raid: Shadow Legends","staminaCost":"0.2","accuracy":"1","selfAtk":"1.25","selfAcc":"1.1"},"Influence":{"name":"Influence","type":"defense","category":"social","animation-name":"defense-social-influence.gif","description":"I've got 100k followers, how many do you have?","staminaCost":"0.15","accuracy":"1","selfAcc":"1.3"},"AdBlock":{"name":"AdBlock","type":"defense","category":"social","animation-name":"defense-social-adblock.gif","description":"Forever Enabled","staminaCost":"0.1","accuracy":"1","selfDef":"1.2","selfEva":"1.2"},"MissedConnection":{"name":"MissedConnection","type":"defense","category":"social","description":"Craigslist's Most Wanted","selfDef":"1.2","selfEva":"1.2"}}; 

return { data: data }; 

})(); 
