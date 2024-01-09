document.body.addEventListener("click", function (event) {
  if (event.target.closest('[wized="copy_share_url"]')) {
    let copyText = document.querySelector(
      '[wized="copyable_share_url"]',
    ).textContent;
    navigator.clipboard
      .writeText(copyText)
      .then(() => {
        let buttonTextElement = document.querySelector(
          '[wized="copy_share_url_text"]',
        );
        let originalText = buttonTextElement.textContent;
        buttonTextElement.textContent = "Copied URL";
        setTimeout(() => {
          buttonTextElement.textContent = originalText;
        }, 600);
      })
      .catch((err) => {
        console.error("Error copying text: ", err);
      });
  }
});

window.onload = async () => {
  Wized.request.awaitAllPageLoad(async () => {
    function getDatesArray(startDate, endDate) {
      const daysArray = [];
      let currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + 1);

      const stopDate = new Date(endDate);
      stopDate.setDate(stopDate.getDate() - 1);

      while (currentDate <= stopDate) {
        daysArray.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return daysArray;
    }

    const checkIn = await Wized.data.get("r.4.d.availability.start_date");
    const startDate = new Date(checkIn);

    const checkOut = await Wized.data.get("r.4.d.availability.end_date");
    const endDate = new Date(checkOut);

    const allowedDates = getDatesArray(startDate, endDate);

    const picker = new easepick.create({
      element: document.getElementById("arrival-picker"),
      css: ["https://csb-hrpwdp.netlify.app/augustcalendar.css"],
      plugins: ["LockPlugin"],
      format: "DD MMM YYYY",
      setup(picker) {
        picker.on("select", async (e) => {
          const { date } = e.detail;
          const selectedDate = date.format("YYYY-MM-DD") + "T00:00:00.000Z";
          await Wized.data.setVariable("newarrival", selectedDate);
        });
      },
      LockPlugin: {
        filter(date, picked) {
          return !allowedDates.includes(date.format("YYYY-MM-DD"));
        },
      },
    });

    picker.gotoDate(startDate);
    picker.setDate(startDate);

    const picker2 = new easepick.create({
      element: document.getElementById("departure-picker"),
      css: ["https://csb-hrpwdp.netlify.app/augustcalendar.css"],
      plugins: ["LockPlugin"],
      format: "DD MMM YYYY",
      setup(picker2) {
        picker2.on("select", async (e) => {
          const { date } = e.detail;
          const selectedDate = date.format("YYYY-MM-DD") + "T00:00:00.000Z";
          await Wized.data.setVariable("newdeparture", selectedDate);
        });
      },
      LockPlugin: {
        filter(date, picked) {
          return !allowedDates.includes(date.format("YYYY-MM-DD"));
        },
      },
    });

    picker2.gotoDate(endDate);
    picker2.setDate(endDate);

    value = await Wized.data.get("r.3.d.0.email");
    console.log(value);
    $productFruits.push([
      "init",
      "u0CJcq08Ggp6KwY8",
      "en",
      { username: value },
    ]);
  });
};
