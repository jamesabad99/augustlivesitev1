window.onload = async () => {
  function readFileAsBase64(file) {
    if (!file) return null;

    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        resolve(e.target.result); // Resolve with the base64 string directly
      };

      reader.readAsDataURL(file);
    });
  }

  // Add event listener to the file input
  const fileInput = document.querySelector('[wized="booking_guest_passport"]');
  if (fileInput) {
    fileInput.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        readFileAsBase64(this.files[0]).then(async (base64String) => {
          console.log(base64String); // For example, log it to the console
          await Wized.data.setVariable("passportimagestring", base64String); // Set value of "v.username"
          // You can also set it to some global variable or state
        });
      }
    });
  }

  Wized.request.awaitAllPageLoad(async () => {
    const checkIn = await Wized.data.get("r.4.d.availability.start_date");
    const checkOut = await Wized.data.get("r.4.d.availability.end_date");
    const arrival = await Wized.data.get("r.4.d.arrival_date");
    const departure = await Wized.data.get("r.4.d.departure_date");

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const arrivalDate = new Date(arrival);
    const departureDate = new Date(departure);

    // Initialize the arrival date picker
    initializeDatePicker(
      "arrival-picker",
      arrivalDate,
      startDate,
      endDate,
      "newarrival"
    );

    // Initialize the departure date picker
    initializeDatePicker(
      "departure-picker",
      departureDate,
      startDate,
      endDate,
      "newdeparture"
    );

    // Other logic...
  });
};

function initializeDatePicker(
  elementId,
  defaultDate,
  minDate,
  maxDate,
  dataVariable
) {
  const picker = new easepick.create({
    element: document.getElementById(elementId),
    css: ["https://csb-hrpwdp.netlify.app/augustcalendar.css"],
    plugins: ["LockPlugin"],
    format: "DD MMM YYYY",
    LockPlugin: {
      minDate: minDate,
      maxDate: maxDate,
    },
    setup(picker) {
      picker.on("select", async (e) => {
        const { date } = e.detail;
        const selectedDate = date.format("YYYY-MM-DD");
        await Wized.data.setVariable(dataVariable, selectedDate);
      });
    },
  });

  picker.gotoDate(defaultDate);
  picker.setDate(defaultDate);
}
