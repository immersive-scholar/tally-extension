"use strict";

var Consumables = (function() { 

var data = 
{"health-cookie":{"ref":"a","slug":"health-cookie","name":"health","type":"cookie","category":"security","val":"0","min":"0","max":"0.2","stat":"health","ext":".gif","sound":"happy","description":"Some cookies are actually useful"},"stamina-cookie":{"ref":"a","slug":"stamina-cookie","name":"stamina","type":"cookie","category":"security","val":"0","min":"0","max":"0.2","stat":"stamina","ext":".gif","sound":"happy","description":"Some cookies provide services for users"},"fortune-cookie":{"ref":"a","slug":"fortune-cookie","name":"fortune","type":"cookie","category":"security","val":"0","min":"-0.2","max":"0.2","stat":"r","ext":".gif","sound":"cautious","description":"You never know what kind of cookie you'll find"},"tracking-cookie":{"ref":"a","slug":"tracking-cookie","name":"bad","type":"cookie","category":"security","val":"0","min":"-0.2","max":"0","stat":"r","ext":".gif","sound":"excited"},"junk-data":{"ref":"some","slug":"junk-data","name":"junk","type":"data","category":"data","val":"0","min":"-0.2","max":"0","stat":"stamina","ext":".gif","sound":"cautious"},"cloud-marketing":{"ref":"some","slug":"cloud-marketing","name":"cloud","type":"marketing","category":"economy","val":"0","min":"-0.2","max":"0","stat":"r","ext":".gif","sound":"cautious"},"design-pattern":{"ref":"a","slug":"design-pattern","name":"design","type":"pattern","category":"computer","val":"0","min":"-0.2","max":"0.2","ext":".gif","sound":"cautious"},"runtime-bug":{"ref":"a","slug":"runtime-bug","name":"runtime","type":"bug","category":"error","val":"0","min":"-0.2","max":"0","ext":".gif","sound":"cautious"}}; 

return { data: data }; 

})(); 
