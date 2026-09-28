/* =========================================================
   Chức năng:
   1. Thanh tiến trình khi cuộn
   2. Hiệu ứng xuất hiện khi scroll
   3. Animation thanh kỹ năng
   4. Hiệu ứng 3D tilt
   5. Magnetic button
   6. Parallax nhẹ cho Hero
   7. Kiểm tra form
   8. Toast thông báo
   ========================================================= */


document.addEventListener("DOMContentLoaded", () => {


  /* =======================================================
     1. SCROLL PROGRESS
     -------------------------------------------------------
     Theo dõi người dùng đang scroll tới đâu trên trang.
     Thanh #scrollProgress sẽ chạy từ 0% -> 100%.
     ======================================================= */

  const scrollProgress =
    document.getElementById("scrollProgress");


  function updateScrollProgress() {

    const scrollTop =
      window.scrollY;


    const scrollHeight =
      document.documentElement.scrollHeight
      - window.innerHeight;


    let progress = 0;


    if (scrollHeight > 0) {

      progress =
        (scrollTop / scrollHeight) * 100;

    }


    scrollProgress.style.width =
      `${progress}%`;

  }


  // Chạy một lần khi trang vừa load
  updateScrollProgress();


  // Cập nhật khi người dùng scroll
  window.addEventListener(
    "scroll",
    updateScrollProgress,
    {
      passive: true
    }
  );



  /* =======================================================
     2. REVEAL ON SCROLL
     -------------------------------------------------------
     Các phần tử có class .reveal sẽ:

     opacity: 0
     translateY(28px)

     Sau khi xuất hiện trong màn hình:
     -> .is-visible
     ======================================================= */

  const revealItems =
    document.querySelectorAll(".reveal");


  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {

        entries.forEach(
          (entry, index) => {

            // Nếu phần tử chưa xuất hiện
            if (!entry.isIntersecting) {
              return;
            }


            /*
              Tạo delay nhẹ giữa các phần tử.

              Ví dụ:
              phần tử 1 -> 0ms
              phần tử 2 -> 70ms
              phần tử 3 -> 140ms
              ...
            */

            entry.target.style.transitionDelay =
              `${Math.min(index * 70, 280)}ms`;


            // Thêm class để CSS chạy animation
            entry.target.classList.add(
              "is-visible"
            );


            // Không cần theo dõi lại phần tử này
            observer.unobserve(
              entry.target
            );

          }
        );

      },
      {
        threshold: 0.14
      }
    );


  // Đăng ký observer cho tất cả reveal element
  revealItems.forEach(
    (item) => {

      revealObserver.observe(item);

    }
  );



  /* =======================================================
     3. ANIMATE SKILL BAR
     -------------------------------------------------------
     HTML có:

     <div class="muc" data-width="90"></div>

     Khi scroll tới:
     width sẽ chuyển từ 0 -> 90%.

     CSS chịu trách nhiệm tạo transition.
     ======================================================= */

  const skillBars =
    document.querySelectorAll(".muc");


  const skillObserver =
    new IntersectionObserver(
      (entries, observer) => {

        entries.forEach(
          (entry) => {

            if (!entry.isIntersecting) {
              return;
            }


            const width =
              entry.target.dataset.width || "0";


            entry.target.style.width =
              `${width}%`;


            // Không animate lại lần nữa
            observer.unobserve(
              entry.target
            );

          }
        );

      },
      {
        threshold: 0.35
      }
    );


  skillBars.forEach(
    (bar) => {

      skillObserver.observe(bar);

    }
  );



  /* =======================================================
     4. KIỂM TRA THIẾT BỊ
     -------------------------------------------------------
     Hiệu ứng chuột sẽ không chạy trên mobile
     hoặc thiết bị không có hover.
     ======================================================= */

  const canHover =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;


  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;



  /* =======================================================
     5. 3D TILT EFFECT
     -------------------------------------------------------
     Khi di chuyển chuột lên card:

     - Tính vị trí chuột
     - Chuyển thành góc xoay X/Y
     - Apply perspective()

     Kết quả:
     Card có cảm giác nổi 3D.
     ======================================================= */

  if (
    canHover &&
    !prefersReducedMotion
  ) {

    const tiltElements =
      document.querySelectorAll(
        "[data-tilt], .tilt-card"
      );


    tiltElements.forEach(
      (element) => {

        /*
          Avatar cho phép xoay mạnh hơn.

          Card bình thường:
          rotate tối đa 4deg

          Avatar:
          rotate tối đa 8deg
        */

        const maxRotate =
          element.hasAttribute("data-tilt")
            ? 8
            : 4;


        /* -----------------------------------------------
           Khi di chuyển chuột
           ----------------------------------------------- */

        element.addEventListener(
          "pointermove",
          (event) => {

            const rect =
              element.getBoundingClientRect();


            /*
              Vị trí chuột bên trong element
            */

            const x =
              event.clientX
              - rect.left;


            const y =
              event.clientY
              - rect.top;


            /*
              Chuyển thành %:

              0 = mép trái / trên
              0.5 = chính giữa
              1 = mép phải / dưới
            */

            const percentX =
              x / rect.width;


            const percentY =
              y / rect.height;


            /*
              Tính góc xoay
            */

            const rotateY =
              (percentX - 0.5)
              * maxRotate;


            const rotateX =
              (0.5 - percentY)
              * maxRotate;


            /*
              Apply 3D
            */

            element.style.transform =
              `perspective(1000px)
               rotateX(${rotateX}deg)
               rotateY(${rotateY}deg)`;

          }
        );


        /* -----------------------------------------------
           Khi chuột rời khỏi element
           ----------------------------------------------- */

        element.addEventListener(
          "pointerleave",
          () => {

            element.style.transform =
              "";

          }
        );

      }
    );

  }



  /* =======================================================
     6. MAGNETIC BUTTON
     -------------------------------------------------------
     Những button có class .magnetic sẽ hơi "hút" theo chuột.
     ======================================================= */

  if (
    canHover &&
    !prefersReducedMotion
  ) {

    const magneticButtons =
      document.querySelectorAll(
        ".magnetic"
      );


    magneticButtons.forEach(
      (button) => {

        /* -----------------------------------------------
           Mouse move
           ----------------------------------------------- */

        button.addEventListener(
          "pointermove",
          (event) => {

            const rect =
              button.getBoundingClientRect();


            /*
              Vị trí chuột
              so với tâm button.
            */

            const x =
              event.clientX
              - rect.left
              - rect.width / 2;


            const y =
              event.clientY
              - rect.top
              - rect.height / 2;


            /*
              Di chuyển button nhẹ theo chuột.
            */

            button.style.transform =
              `translate(
                ${x * 0.10}px,
                ${y * 0.10}px
              )`;

          }
        );


        /* -----------------------------------------------
           Mouse leave
           ----------------------------------------------- */

        button.addEventListener(
          "pointerleave",
          () => {

            button.style.transform =
              "";

          }
        );

      }
    );

  }



  /* =======================================================
     7. PARALLAX HERO
     -------------------------------------------------------
     Hero visual di chuyển nhẹ theo chuột.

     Không áp dụng trên mobile.
     ======================================================= */

  if (
    canHover &&
    !prefersReducedMotion
  ) {

    const heroVisual =
      document.querySelector(
        ".hero-visual"
      );


    window.addEventListener(
      "pointermove",
      (event) => {

        if (!heroVisual) {
          return;
        }


        /*
          Chuyển vị trí chuột thành khoảng:

          -1 -> 1
        */

        const x =
          (
            event.clientX /
            window.innerWidth
          ) - 0.5;


        const y =
          (
            event.clientY /
            window.innerHeight
          ) - 0.5;


        /*
          Di chuyển cực nhẹ.
        */

        heroVisual.style.transform =
          `translate3d(
            ${x * 8}px,
            ${y * 7}px,
            0
          )`;

      }
    );


    /*
      Khi chuột rời khỏi window
      đưa visual về vị trí ban đầu.
    */

    window.addEventListener(
      "pointerleave",
      () => {

        if (heroVisual) {

          heroVisual.style.transform =
            "";

        }

      }
    );

  }



  /* =======================================================
     8. CONTACT FORM
     -------------------------------------------------------
     Form này chưa gửi dữ liệu lên server.

     Khi submit:
     -> chặn reload
     -> kiểm tra dữ liệu
     -> báo lỗi nếu thiếu
     -> hiện thông báo nếu thành công
     -> reset form
     ======================================================= */

  const form =
    document.getElementById(
      "form-lien-he"
    );


  const thongBao =
    document.getElementById(
      "thong-bao"
    );


  /*
    Lấy Toast
  */

  const toast =
    document.getElementById(
      "toast"
    );


  const toastText =
    document.getElementById(
      "toastText"
    );


  const toastClose =
    document.getElementById(
      "toastClose"
    );


  /*
    Biến lưu timer của toast
    để có thể reset thời gian.
  */

  let toastTimer = null;



  /* =======================================================
     9. HÀM HIỆN TOAST
     ======================================================= */

  const showToast =
    (message) => {

      toastText.textContent =
        message;


      toast.classList.add(
        "show"
      );


      /*
        Nếu đang có timer cũ
        thì xóa trước.
      */

      clearTimeout(
        toastTimer
      );


      /*
        Tự động đóng sau 4.5 giây
      */

      toastTimer =
        setTimeout(
          () => {

            toast.classList.remove(
              "show"
            );

          },
          4500
        );

    };



  /* =======================================================
     10. NÚT ĐÓNG TOAST
     ======================================================= */

  toastClose.addEventListener(
    "click",
    () => {

      toast.classList.remove(
        "show"
      );

    }
  );



  /* =======================================================
     11. CÁC FIELD CẦN KIỂM TRA
     ======================================================= */

  const ten =
    document.getElementById(
      "ten"
    );


  const mail =
    document.getElementById(
      "mail"
    );


  const noidung =
    document.getElementById(
      "noidung"
    );


  const fields = [
    ten,
    mail,
    noidung
  ];



  /* =======================================================
     12. XÓA TRẠNG THÁI LỖI
     ======================================================= */

  const clearInvalid =
    (field) => {

      field.classList.remove(
        "invalid"
      );

    };



  /* =======================================================
     13. KHI NGƯỜI DÙNG ĐANG NHẬP
     -------------------------------------------------------
     Khi bắt đầu sửa input:
     -> bỏ màu đỏ
     -> xóa thông báo lỗi
     ======================================================= */

  fields.forEach(
    (field) => {

      field.addEventListener(
        "input",
        () => {

          clearInvalid(
            field
          );


          thongBao.textContent =
            "";


          thongBao.className =
            "form-message";

        }
      );

    }
  );



  /* =======================================================
     14. SUBMIT FORM
     ======================================================= */

  form.addEventListener(
    "submit",
    (event) => {

      /*
        Đây là dòng rất quan trọng.

        Không cho trình duyệt
        reload trang.
      */

      event.preventDefault();


      /*
        Reset trạng thái lỗi
      */

      fields.forEach(
        clearInvalid
      );


      let isValid = true;



      /* -----------------------------------------------
         Kiểm tra HỌ TÊN
         ----------------------------------------------- */

      if (
        !ten.value.trim()
      ) {

        ten.classList.add(
          "invalid"
        );

        isValid = false;

      }



      /* -----------------------------------------------
         Kiểm tra EMAIL
         ----------------------------------------------- */

      if (
        !mail.value.trim()
        ||
        !mail.validity.valid
      ) {

        mail.classList.add(
          "invalid"
        );

        isValid = false;

      }



      /* -----------------------------------------------
         Kiểm tra NỘI DUNG
         ----------------------------------------------- */

      if (
        !noidung.value.trim()
      ) {

        noidung.classList.add(
          "invalid"
        );

        isValid = false;

      }



      /* =================================================
         Nếu dữ liệu không hợp lệ
         ================================================= */

      if (!isValid) {

        thongBao.textContent =
          "Bạn hãy kiểm tra lại các trường bắt buộc nhé.";


        thongBao.className =
          "form-message error";


        return;

      }



      /* =================================================
         Nếu form hợp lệ
         ================================================= */

      const name =
        ten.value.trim();


      /*
        Thông báo phía dưới form
      */

      thongBao.textContent =
        `Cảm ơn ${name}! Mình đã nhận được lời nhắn của bạn.`;


      thongBao.className =
        "form-message success";


      /*
        Toast nổi phía dưới màn hình
      */

      showToast(
        `Cảm ơn ${name}, tin nhắn đã được ghi nhận!`
      );


      /*
        Reset tất cả input
      */

      form.reset();

    }
  );

});