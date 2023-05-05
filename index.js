var packet
let packet_list = [];
var max_voltage = 0;
var min_voltage=450;
var avg_packet
var voltage;
var val=0;
async function startSerial() {
  if ("serial" in navigator) {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({
        baudRate: 9600, // Set the baud rate to 9600
        dataBits: 8,
        stopBits: 1,
        parity: "none",
        flowControl: "none",
      });

      console.log("Serial Port Opened");

      const reader = port.readable.getReader();

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          console.log("Reader has been canceled");
          break;
        }

        packet = new TextDecoder().decode(value).trim();
        voltage = parseFloat(packet);
        
        packet_list.push(parseFloat(packet));
        document.getElementById("pac").innerHTML = packet;

        

        //send mail if voltage is low
        if(voltage<10 && val==0){
          try{
            console.log("Current Packet: ", packet);
            console.log("Avg",avg_packet.toFixed(2));
          
            var params = {
              current_voltage: packet,
              mesage:"Alert ! voltage reached lower the limit",
              sub:"voltage is low!"
            };
            const serviceID = "service_1tl8y6c";
            const templateID = "template_410ut7o";
            console.log("alert-mailsent");
            
            emailjs.send(serviceID, templateID, params);
            val=1;
          }
          catch{
            console.log("err");
          }
        }

        //send mail if voltage if high
        else if(voltage>400 && val==0 && packet_list.length >= 10){
          try{
            console.log("Current Packet: ", packet);
            console.log("Avg",avg_packet.toFixed(2));
          
            var params = {
              current_voltage: packet,
              mesage:"Alert ! voltage reached higher the limit",
              sub:"voltage is high!"
            };
            const serviceID = "service_1tl8y6c";
            const templateID = "template_410ut7o";
            console.log("alert-mailsent");
            
            emailjs.send(serviceID, templateID, params);
            val=1;
          }
          catch{
            console.log("err");
          }
        }
        else{
          val=1;
        }
        

        //to display in webpage.
        if (packet_list.length >= 10) { //Max-voltage.
          if ((voltage > max_voltage)&&(voltage<450)) {
            max_voltage = voltage;
          }
  
          //Min-voltage.
          if ((voltage < min_voltage)) {
            min_voltage = voltage;
          }
          avg_packet = packet_list.slice(-10).reduce((a, b) => a + b) / 10;
          document.getElementById("avg").innerHTML = avg_packet.toFixed(2);
          document.getElementById("max").innerHTML = max_voltage;
          document.getElementById("min").innerHTML= min_voltage;
        }

        await new Promise((resolve) => setTimeout(resolve, 1100));
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("Web serial not supported");
  }
}

//to send mail manually
function send_mail(){
  console.log("Current Packet: ", packet);
  console.log("Avg",avg_packet.toFixed(2));

  var params = {
    current_voltage: packet,
    avg_voltage: avg_packet.toFixed(2),
    max_voltage: max_voltage,
    min_voltage:min_voltage,
  };
  const serviceID = "service_1tl8y6c";
  const templateID = "template_lc75t1n";
  
  emailjs.send(serviceID, templateID, params)
  alert("Your message sent successfully!!")
}

//To send mail automatically.
setInterval(function(){
  console.log("Current Packet: ", packet);
  console.log("Avg",avg_packet.toFixed(2));

  var params = {
    current_voltage: packet,
    avg_voltage: avg_packet.toFixed(2),
    max_voltage: max_voltage,
    min_voltage:min_voltage,
  };
  const serviceID = "service_1tl8y6c";
  const templateID = "template_lc75t1n";
  console.log("automatic-mailsent");
  
  emailjs.send(serviceID, templateID, params)
},100*1000);





