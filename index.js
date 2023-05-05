var packet
let packet_list = [];
var max_voltage = 0;
var min_voltage=450;
var avg_packet
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
        const voltage = parseFloat(packet);
        packet_list.push(parseFloat(packet));
        document.getElementById("pac").innerHTML = packet;
        
        //Max-voltage.
        if ((voltage > max_voltage)&&(voltage<450)) {
          max_voltage = voltage;
        }
        //Min-voltage.
        if ((voltage < min_voltage)) {
          min_voltage = voltage;
        }
        //to display in webpage.
        if (packet_list.length >= 10) { 
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
  console.log("mailsent");
  
  emailjs.send(serviceID, templateID, params)
},100*1000);

