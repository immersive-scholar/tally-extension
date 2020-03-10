"use strict";

var Attacks = (function() { 

var data = 
{"BaitAndSwitch":{"name":"BaitAndSwitch","type":"attack","category":"economy","special":"opp-loses-1-turn","description":"Steal a turn from your opponent","notes and ideas":"You set out to do one thing but a different undesirable thing happens instead","staminaCost":"0.1","accuracy":"1","crtChance":"0.1","oppHealth":"0.2","oppAcc":"0.15"},"LootBox":{"name":"LootBox","type":"attack","category":"economy","description":"This attack is banned in some countries","notes and ideas":"Being banned across EU","staminaCost":"0.1","accuracy":"0.8","crtChance":"0.2","oppHealth":"0.15","oppAcc":"0.2"},"MicroTransaction":{"name":"MicroTransaction","type":"attack","category":"economy","description":"Nickle and dime the opponent","staminaCost":"0.05","accuracy":"1","oppHealth":"0.15","oppDef":"0.1","oppAtk":"0.1","oppAcc":"0.1","oppEva":"0.1"},"ConfirmShaming":{"name":"ConfirmShaming","type":"attack","category":"economy","description":"Shame the monster into compliance","notes and ideas":" The option to decline is worded in such a way as to shame the user into compliance.","staminaCost":"0.12","accuracy":"1","crtChance":"0.1","oppHealth":"0.15","oppEva":"0.2"},"PayToWin":{"name":"PayToWin","type":"defense","category":"economy","description":"Not all games have to be this way","staminaCost":"0.15","accuracy":"1","selfHealth":"1.1","selfAtk":"0.2"},"DarkPattern":{"name":"DarkPattern","type":"defense","category":"economy","description":"A devious technique to trick the monster","notes and ideas":"devious online techniques that manipulate users into doing things they might not otherwise choose to.","staminaCost":"0.1","accuracy":"1","crtChance":"0.1","selfHealth":"1.1","selfAcc":"1.25","selfEva":"1.1"},"HiddenCosts":{"name":"HiddenCosts","type":"defense","category":"economy","special":"opp-loses-2-turns","description":"Always beware fine print","notes and ideas":"You get to the last step of the checkout process only to discover some unexpected charges have appeared e.g. delivery charges, tax, etc.","staminaCost":"0.1","accuracy":"1","crtChance":"0.1","selfHealth":"1.05","selfAcc":"1.2","selfEva":"1.15"},"MegaByte":{"name":"MegaByte","type":"attack","category":"computer","animation-name":"attack-computer.gif","sound":"computer-megabyte.wav","description":"Beware the power of 2","staminaCost":"0.2","accuracy":"1","crtChance":"0.1","oppHealth":"0.4","damageOTChance":"0.25","damageOverTime":"0.3","turns":"2"},"BitBolt":{"name":"BitBolt","type":"attack","category":"computer","animation-name":"attack-computer.gif","sound":"computer-megabyte.wav","staminaCost":"0.1","accuracy":"0.9","crtChance":"0.1","oppHealth":"0.2"},"LowBattery":{"name":"LowBattery","type":"attack","category":"computer","sound":"computer-lowbattery.wav","special":"opp-loses-2-turns","description":"Steal two turns from your opponent!","staminaCost":"0.1","accuracy":"1","oppHealth":"0.1","oppDef":"0.1","oppAcc":"0.1"},"DriverUpdate":{"name":"DriverUpdate","type":"defense","category":"computer","animation-name":"defense-computer.gif","sound":"computer-reboot.wav","staminaCost":"0.1","accuracy":"1","selfHealth":"1.1","selfDef":"1.1","selfAcc":"1.2"},"Reboot":{"name":"Reboot","type":"defense","category":"computer","animation-name":"defense-computer.gif","sound":"computer-reboot.wav","notes and ideas":"High Mana cost, player 'shuts down' for 2 turns, after, they regain a large portion of health","staminaCost":"0.18","accuracy":"1","selfHealth":"1.5"},"CryptCracker":{"name":"CryptCracker","type":"attack","category":"cryptography","animation-name":"attack-cryptography-cryptcracker.gif","sound":"cryptography-cryptcracker.wav","staminaCost":"0.1","accuracy":"0.85","crtChance":"0.1","oppHealth":"0.25"},"CryptoSlam":{"name":"CryptoSlam","type":"attack","category":"cryptography","staminaCost":"0.1","oppHealth":"0.2","oppAcc":"0.2"},"Triangulate":{"name":"Triangulate","type":"attack","category":"cryptography","animation-name":"attack-cryptography-triangulate.gif","notes and ideas":"Increases accuracy. If used three times in a row, attacks will never miss","staminaCost":"0.1","accuracy":"0.95","crtChance":"0.1","oppHealth":"0.2","oppEva":"0.25"},"AlgoRhythm":{"name":"AlgoRhythm","type":"defense","category":"cryptography","sound":"cryptography-algorhythm.wav","special":"qte","notes and ideas":"Initiate QTE to increase how much damage you deal.","staminaCost":"0.15","accuracy":"1","crtChance":"0.1","selfHealth":"1.1"},"Overcompress":{"name":"Overcompress","type":"attack","category":"data","notes and ideas":"Destroys some of the enemy’s stamina/mana","staminaCost":"0.12","accuracy":"0.8","crtChance":"0.1","oppHealth":"0.2"},"CorruptDrive":{"name":"CorruptDrive","type":"attack","category":"data","throw":"true","staminaCost":"0.1","accuracy":"1","crtChance":"0.1","oppHealth":"0.3","confuseChance":"0.75"},"DataCorruption":{"name":"DataCorruption","type":"attack","category":"data","throw":"true","staminaCost":"0.12","accuracy":"0.85","crtChance":"0.1","oppHealth":"0.15","oppDef":"0.3"},"CyberOptimize":{"name":"CyberOptimize","type":"defense","category":"data","staminaCost":"0.15","accuracy":"1","crtChance":"0.3","selfHealth":"1.2","selfAcc":"1.25","selfEva":"1.15"},"UserError":{"name":"UserError","type":"attack","category":"error","notes and ideas":"Chance for High Damage, but Chance for Self-Damage and Confusion","staminaCost":"0.12","accuracy":"1","crtChance":"0.2","oppHealth":"0.25"},"BannerOverload":{"name":"BannerOverload","type":"attack","category":"error","staminaCost":"0.15","accuracy":"0.95","crtChance":"0.1","oppHealth":"0.3"},"PacketLoss":{"name":"PacketLoss","type":"attack","category":"error","staminaCost":"0.1","accuracy":"1","crtChance":"0.1","oppHealth":"0.2","oppAtk":"0.25"},"BleedingEdge":{"name":"BleedingEdge","type":"attack","category":"error","staminaCost":"0.15","accuracy":"0.95","crtChance":"0.4","oppHealth":"0.2"},"BugFix":{"name":"BugFix","type":"defense","category":"error","staminaCost":"0.15","accuracy":"1","selfHealth":"1.3","selfDef":"1.2"},"RandomAccess":{"name":"RandomAccess","type":"attack","category":"memory","notes and ideas":"Uses an Random Move from the list","staminaCost":"0.18","accuracy":"0.95","crtChance":"0.1","oppHealth":"0.2","oppDef":"0.2"},"RAMHog":{"name":"RAMHog","type":"attack","category":"memory","staminaCost":"0.15","accuracy":"0.9","crtChance":"0.1","oppHealth":"0.25","oppEva":"0.3"},"MemoryFlare":{"name":"MemoryFlare","type":"attack","category":"memory","animation-name":"attack-memory-memoryflare.gif","sound":"memory-memoryflare.wav","staminaCost":"0.1","accuracy":"1","oppHealth":"0.3","oppAtk":"0.25"},"CacheErase":{"name":"CacheErase","type":"defense","category":"memory","staminaCost":"0.2","accuracy":"1","selfHealth":"1.2","selfEva":"1.25"},"TraceRoute":{"name":"TraceRoute","type":"attack","category":"network","staminaCost":"0.1","accuracy":"1","crtChance":"0.1","oppHealth":"0.2","oppAcc":"0.2","damageOTChance":"0.85","damageOverTime":"0.2","turns":"2"},"SlowConnection":{"name":"SlowConnection","type":"attack","category":"network","animation-name":"attack-network-slowconnection.gif","sound":"network-connection.wav","staminaCost":"0.1","accuracy":"0.9","crtChance":"0.1","oppHealth":"0.2","oppAcc":"0.3"},"OMGDDOS":{"name":"OMGDDOS","type":"attack","category":"network","staminaCost":"0.18","accuracy":"1","crtChance":"0.1","oppHealth":"0.2"},"DomainSwipe":{"name":"DomainSwipe","type":"defense","category":"network","animation-name":"defense-network-domainswipe.gif","sound":"network-domainswipe.wav","notes and ideas":"Switch a random stat with the enemy","staminaCost":"0.15","accuracy":"1","selfAcc":"1.2"},"EnableVPN":{"name":"EnableVPN","type":"defense","category":"network","special":"lock","notes and ideas":"Stats are locked for 3 turns","staminaCost":"0.1","accuracy":"1","selfDef":"1.2","turns":"3"},"PacketShield":{"name":"PacketShield","type":"defense","category":"network","animation-name":"defense-network-packetshield.gif","staminaCost":"0.1","accuracy":"1","selfDef":"1.1","selfEva":"1.2","turns":"3"},"AttachTracker":{"name":"AttachTracker","type":"attack","category":"security","animation-name":"attack-security-attachtracker.gif","sound":"security-attachtracker.wav","notes and ideas":"Damage over time, increasing with how many trackers are placed on a enemy. Trackers fade after a certain number of turns.","staminaCost":"0.1","accuracy":"0.9","crtChance":"0.1","oppHealth":"0.2","oppDef":"0.2","damageOTChance":"0.7","damageOverTime":"0.2","turns":"2"},"ViralInfection":{"name":"ViralInfection","type":"attack","category":"security","animation-name":"attack-security-viralinfection.gif","staminaCost":"0.15","accuracy":"1","crtChance":"0.1","oppHealth":"0.2","oppEva":"0.25","damageOTChance":"1","damageOverTime":"0.3","turns":"3"},"GoPhish":{"name":"GoPhish","type":"attack","category":"security","animation-name":"attack-security-gophish.gif","sound":"security-gophish.wav","sound-delay":"300","special":"qte","notes and ideas":"Trigger QTE in opponent, if they fail, damage inversely proportional to how many times they lasted.","staminaCost":"0.12","accuracy":"1","crtChance":"0.1","oppHealth":"0.25"},"IdentityTheft":{"name":"IdentityTheft","type":"attack","category":"security","special":"opp-loses-2-turns","description":"Steal two turns from your opponent!","notes and ideas":"Steals HP and stamina/mana from enemy","staminaCost":"0.2","accuracy":"0.9","crtChance":"0.1","oppHealth":"0.1","oppAcc":"0.1"},"SpamBush":{"name":"SpamBush","type":"attack","category":"security","staminaCost":"0.15","accuracy":"0.8","crtChance":"0.1","oppHealth":"0.2","oppEva":"0.25"},"Firewall":{"name":"Firewall","type":"defense","category":"security","animation-name":"defense-security-firewall.gif","sound":"security-firewall.wav","staminaCost":"0.15","accuracy":"1","selfHealth":"1.1","selfDef":"1.2"},"DenyAccess":{"name":"DenyAccess","type":"defense","category":"security","special":"opp-loses-1-turn","description":"Steal a turn from your opponent","notes and ideas":"Slightly Increase DEF, Chance to Deny Enemy Turn","staminaCost":"0.2","accuracy":"1","selfDef":"1.15"},"FilterBurn":{"name":"FilterBurn","type":"defense","category":"security","notes and ideas":"Remove previously used enemy attack for 3 turns","staminaCost":"0.15","accuracy":"1","selfEva":"1.2"},"TagCurse":{"name":"TagCurse","type":"attack","category":"social","animation-name":"attack-social-tagcurse.gif","sound":"social-tagcurse.wav","notes and ideas":"Once activated, the character will only use pre-roll until it misses.","staminaCost":"0.1","accuracy":"0.8","crtChance":"0.1","oppHealth":"0.2","oppDef":"0.25"},"EmailBlitz":{"name":"EmailBlitz","type":"attack","category":"social","animation-name":"attack-social-emailblitz.gif","sound":"social-emailblitz.wav","staminaCost":"0.18","accuracy":"0.8","crtChance":"0.1","oppHealth":"0.3","damageOTChance":"0.25","damageOverTime":"0.1","turns":"2"},"ClickStrike":{"name":"ClickStrike","type":"attack","category":"social","animation-name":"attack-social-clickstrike.gif","sound":"social-clickstrike.wav","staminaCost":"0.15","accuracy":"0.95","crtChance":"0.1","oppHealth":"0.15"},"PrivacyLeech":{"name":"PrivacyLeech","type":"attack","category":"social","animation-name":"attack-social-privacyleech.gif","special":"opp-loses-1-turn","description":"Steal a turn from your opponent","notes and ideas":"Chance to hit, but neither player will know if it has for 2 turns, at which point the opponent’s defense will drop dramatically.","staminaCost":"0.15","accuracy":"1","crtChance":"0.1","oppHealth":"0.15","oppDef":"0.1"},"Klomper":{"name":"Klomper","type":"attack","category":"social","animation-name":"attack-social-klomper.gif","special":"opp-loses-2-turns","description":"Ooh, you gotta download Klomper","notes and ideas":"https://www.vulture.com/2017/07/marc-maron-doesnt-have-time-to-watch-the-hit-new-streaming-show-turd-journey.html","staminaCost":"0.15","accuracy":"1","crtChance":"0.1","oppHealth":"0.15","oppDef":"0.1"},"CrowdReach":{"name":"CrowdReach","type":"defense","category":"social","animation-name":"defense-social-crowdreach.gif","sound":"social-crowdreach.wav","staminaCost":"0.2","accuracy":"1","selfAtk":"1.25","selfAcc":"1.1"},"Influence":{"name":"Influence","type":"defense","category":"social","animation-name":"defense-social-influence.gif","staminaCost":"0.15","accuracy":"1","selfAcc":"1.3"},"AdBlock":{"name":"AdBlock","type":"defense","category":"social","animation-name":"defense-social-adblock.gif","staminaCost":"0.1","accuracy":"1","selfDef":"1.2","selfEva":"1.2"},"MissedConnection":{"name":"MissedConnection","type":"defense","category":"social","selfDef":"1.2","selfEva":"1.2"}}; 

return { data: data }; 

})(); 
