// ดึง element container จาก DOM ที่มี id เป็น "pokemon-container" เพื่อใช้เป็นพื้นที่แสดงผลการ์ดโปเกมอน
const pokemonContainer = document.getElementById("pokemon-container");

// ดึง element ปุ่มค้นหาจาก DOM ที่มี id เป็น "findPokemon"
const fetchButton = document.getElementById("findPokemon");

// เพิ่ม event listener ให้กับปุ่มค้นหา เมื่อเกิดเหตุการณ์คลิก (click) จะสั่งให้ทำงานตามฟังก์ชันลูกศรด้านใน
fetchButton.addEventListener("click", () => {
  // อ่านค่าข้อความที่ผู้ใช้กรอกในช่อง input ที่มี id เป็น "pokemonInput"
  const inputPokemon = document.getElementById("pokemonInput").value;

  // ส่ง HTTP GET request ไปยัง PokéAPI โดยใช้ชื่อหรือ ID ของโปเกมอนที่กรอกเข้ามา
  fetch(`https://pokeapi.co/api/v2/pokemon/${inputPokemon}`)
    // แปลงผลลัพธ์การตอบกลับ (response) จาก API ให้อยู่ในรูปแบบ JSON
    .then((response) => response.json())
    // นำข้อมูล (data) โปเกมอนที่แปลงแล้วมาใช้ในการประมวลผลต่อ
    .then((data) => {
      // ล้างข้อมูลและ HTML ทั้งหมดที่เคยแสดงอยู่ใน pokemonContainer ให้ว่างเปล่า
      pokemonContainer.innerHTML = "";
      // สร้าง element <div> ใหม่ขึ้นมาสำหรับใช้เป็นตัวการ์ดโปเกมอน
      const pokemonDiv = document.createElement("div");
      // เพิ่ม class "pokemon-card" ให้กับ <div> การ์ด เพื่อให้นำสไตล์จาก CSS มาปรับแต่ง
      pokemonDiv.classList.add("pokemon-card");
      // สร้าง element <h3> ขึ้นมาสำหรับแสดงชื่อโปเกมอน
      const pokemonName = document.createElement("h3");
      // กำหนดข้อความใน <h3> เป็นชื่อของโปเกมอนที่ได้มาจาก API (data.name)
      pokemonName.textContent = data.name;

      // สร้าง element <img> ขึ้นมาสำหรับแสดงรูปภาพโปเกมอน
      const pokemonImage = document.createElement("img");
      // กำหนดที่อยู่รูปภาพ (src) โดยใช้ URL รูปภาพด้านหน้า (front_default) จาก API
      pokemonImage.src = data.sprites.front_default;

      // สร้าง element <p> ขึ้นมาสำหรับแสดงความสามารถ (ability) ของโปเกมอน
      const pokemonAbility = document.createElement("p");
      // กำหนดข้อความใน <p> เป็นชื่อความสามารถแรกของโปเกมอนจาก API
      pokemonAbility.textContent = data.abilities[0].ability.name;

      // นำ element ชื่อโปเกมอน <h3> ใส่เข้าไปข้างใน <div> การ์ด
      pokemonDiv.appendChild(pokemonName);
      // นำ element รูปภาพโปเกมอน <img> ใส่เข้าไปข้างใน <div> การ์ด
      pokemonDiv.appendChild(pokemonImage);
      // นำ element ความสามารถโปเกมอน <p> ใส่เข้าไปข้างใน <div> การ์ด
      pokemonDiv.appendChild(pokemonAbility);

      // นำ <div> การ์ดโปเกมอนทั้งหมดที่สร้างเสร็จแล้ว ใส่เข้าไปข้างใน pokemonContainer บนหน้าเว็บ
      pokemonContainer.appendChild(pokemonDiv);
    })
    // ดักจับข้อผิดพลาด (error) ในกรณีที่ดึงข้อมูลจาก API ไม่สำเร็จ เช่น ค้นหาไม่พบ หรือเครือข่ายมีปัญหา
    .catch((error) => {
      // แสดงข้อความข้อผิดพลาดลงใน Console ของบราวเซอร์
      console.log("Error:", error);
    });
});

// ดึง element ปุ่มรีเซ็ตจาก DOM ที่มี id เป็น "resetPokemon"
const resetButton = document.getElementById("resetPokemon");
// เพิ่ม event listener ให้กับปุ่มรีเซ็ต เมื่อคลิกจะสั่งให้ฟังก์ชันทำงาน
resetButton.addEventListener("click", () => {
  // ล้างเนื้อหา HTML ด้านใน pokemonContainer ออกทั้งหมด เพื่อลบการ์ดโปเกมอนที่แสดงอยู่
  pokemonContainer.innerHTML = "";
});