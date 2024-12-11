import { For } from "solid-js";
import emptyStar from "../../../svg-images/svgexport-24.svg";
import fullStar from "../../../svg-images/svgexport-19.svg";
import { A } from "@solidjs/router";

export const Review = () => {
  const mock_data = [
    {
      name: "მაიკლ გოუ",
      date: "ნოემბერი 18, 2023, 15:35",
      verifiedPurchase: "დადასტურებული შეკვეთა",
      review:
        "ჩემი ძველი iMac 2013 წლიდან იყო. ეს ჩანაცვლება ძალიან საჭირო იყო. ძალიან სწრაფია, და ფერი იდეალურად შეესაბამება ჩემს ოფისის დიზაინს. ეკრანი შეუდარებელია და ძალიან კმაყოფილი ვარ ამ შესყიდვით.",
      wasHelpful: {
        yes: 5,
        no: 0,
      },
    },
    {
      name: "გიორგი ცინცაძე",
      date: "ნოემბერი 16, 2023, 10:22",
      verifiedPurchase: "დადასტურებული შეკვეთა",
      review:
        "ეს ახალი iMac საოცრად სწრაფია. ჩემი სახლის სამუშაო სივრცეში იდეალურად ჩაჯდა.",
      wasHelpful: {
        yes: 2,
        no: 1,
      },
    },
    {
      name: "ეკა აბრამიშვილი",
      date: "ნოემბერი 17, 2023, 14:50",
      verifiedPurchase: "დადასტურებული შეკვეთა",
      review:
        "ძალიან ეფექტური პროდუქტია. იდეალური გამოსახულება და სრულყოფილი სიჩქარე.",
      wasHelpful: {
        yes: 4,
        no: 0,
      },
    },
    {
      name: "ლევან ჩხარტიშვილი",
      date: "ნოემბერი 19, 2023, 12:30",
      verifiedPurchase: "დადასტურებული შეკვეთა",
      review: "შესანიშნავი პროდუქტია! მაჩვდა სწრაფ და სრულყოფილ მუშაობას.",
      wasHelpful: {
        yes: 3,
        no: 2,
      },
    },
    {
      name: "ნინო ბერიძე",
      date: "ნოემბერი 18, 2023, 16:05",
      verifiedPurchase: "დადასტურებული შეკვეთა",
      review: "ძალიან ლამაზი დიზაინი და ძალიან სწრაფი მუშაობა. კმაყოფილი ვარ.",
      wasHelpful: {
        yes: 6,
        no: 0,
      },
    },
  ];

  const reviews = [
    {
      rating: 5,
      reviewCount: 239,
    },
    {
      rating: 4,
      reviewCount: 158,
    },
    {
      rating: 3,
      reviewCount: 320,
    },
    {
      rating: 2,
      reviewCount: 102,
    },
    {
      rating: 1,
      reviewCount: 85,
    },
  ];
  

  const add_review_modal = () => {};

  return (
    <section class="bg-white py-8 antialiased md:py-16">
      <div class="px-4 2xl:px-0">
        <div class="flex items-center gap-2">
          <h2 class="text-2xl font-[bolder-font] text-gray-900">
            შეფასებები
          </h2>

          <div class="mt-2 flex items-center gap-2 sm:mt-0">
            <div class="flex items-center gap-0.5">
              <img src={fullStar}></img>
              <img src={fullStar}></img>
              <img src={fullStar}></img>
              <img src={fullStar}></img>
              <img src={fullStar}></img>
            </div>
            <p class="text-sm font-medium leading-none text-gray-500">
              (4.6)
            </p>
            <a
              href="#"
              class="text-sm font-medium leading-none text-gray-900 underline hover:no-underline"
            >
              {" "}
              645 შეფასება{" "}
            </a>
          </div>
        </div>

        <div class="my-6 gap-8 sm:flex sm:items-start md:my-8">
          <div class="shrink-0 space-y-4">
            <p class="text-2xl font-[bolder-font] leading-none text-gray-900">
              ჯამში: 4.65
            </p>
            <button
              type="button"
              data-modal-target="review-modal"
              data-modal-toggle="review-modal"
              class="mb-2 me-2 rounded-lg font-[bolder-font] px-5 hover:bg-dark-green-hover duration-200 py-2.5 text-sm text-white bg-dark-green"
            >
              დაწერე შეფასება
            </button>
          </div>
          <div class="flex flex-col gap-y-2">
          <For each={reviews}>{(r) => {
            return <div class="mt-6 min-w-0 flex-1 space-y-3 sm:mt-0">
            <A href="#" class="flex group hover:underline hover:decoration-gr items-center gap-2">
              <p class="w-2 shrink-0 text-start group-hover:text-dark-green text-sm font-medium leading-none text-gray-900">
                {r.rating}
              </p>
              <img src={fullStar}></img>

              <div class="h-3.5 w-80 rounded-full bg-gray-200">
                <div
                  class="h-3.5 rounded-full bg-dark-green"
                  style="width: 20%"
                ></div>
              </div>
              <span
                href="#"
                class="w-8 shrink-0 group-hover:text-dark-green text-right text-sm font-medium leading-none text-primary-700 sm:w-auto sm:text-left"
              >
                {r.reviewCount} შეფასება
              </span>
            </A>

          </div>
          }}</For>
          </div>
        </div>

        <div class="mt-6 divide-y divide-gray-200">
          <For each={mock_data}>
            {(d) => {
              return (
                <div class="gap-3 pb-6 sm:flex sm:items-start">
                  <div class="shrink-0 space-y-2 sm:w-48 md:w-72">
                    <div class="flex items-center gap-0.5">
                      <img src={fullStar}></img>

                      <img src={fullStar}></img>

                      <img src={fullStar}></img>

                      <img src={fullStar}></img>

                      <img src={fullStar}></img>
                    </div>

                    <div class="space-y-0.5">
                      <p class="text-base font-[normal-font] font-bold text-gray-800">
                        {d.name}
                      </p>
                      <p class="text-sm font-[normal-font] font-semibold text-gray-500">
                        {d.date}
                      </p>
                    </div>

                    <div class="inline-flex items-center gap-1">
                      <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="#14A800"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <p class="text-sm font-[bolder-font] text-gray-700 font-bold">
                        {d.verifiedPurchase}
                      </p>
                    </div>
                  </div>

                  <div class="mt-4 min-w-0 flex-1 space-y-4 sm:mt-0">
                    <p class="text-sm font-[normal-font] text-gray-500 font-bold">
                      {d.review}
                    </p>
                  </div>
                </div>
              );
            }}
          </For>
        </div>

        <div class="mt-6 text-center">
          <button
            type="button"
            class="mb-2 me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          >
            ნახე მეტი
          </button>
        </div>
      </div>
    </section>
  );
};
