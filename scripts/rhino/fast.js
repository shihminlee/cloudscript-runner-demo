function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
}

function jsFunction(s) {
  sleepFor(0);
   return Math.random();
}
