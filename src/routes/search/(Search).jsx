import { A, createAsync, useSearchParams } from "@solidjs/router";
import { Header } from "~/Components/Header";
import { MainSearch } from "../api/search";
import { For } from "solid-js";
import defaultProfileSVG from "../../default_profile.png";
import emptyStar from "../../svg-images/svgexport-24.svg";
import fullStar from "../../svg-images/svgexport-19.svg";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const results = createAsync(() =>
    MainSearch(searchParams.type, searchParams.name)
  );

  console.log(results());
  return (
    <div>
      <Header></Header>
      <section class="mx-5 my-3">
  <div class="mb-4">
    <h1 class="text-2xl font-bold">შედეგები</h1>
  </div>
  <div class="flex flex-col gap-y-4">
    <For each={results()?.reverse()}>
      {(s) => {
        return (
          <div class="border-2 p-5 border-gray-300 rounded-lg shadow-lg">
            <div class="flex items-start gap-4">
              <img
                id="setup_image"
                src={defaultProfileSVG}
                alt="Profile"
                class="w-[80px] h-[80px] rounded-full border-2 border-gray-300"
              />
              <div class="flex-1">
                <div class="flex justify-between mb-2">
                  <h2 class="text-lg font-semibold">
                    {s.firstname} {s.lastname}
                  </h2>
                  <p class="text-xs font-bold text-gray-600">
                    შემოუერთდა {s.createdAt}
                  </p>
                </div>
                <p class="text-gray-700 mb-4">{s.about}</p>
                <p class="text-sm text-gray-500">{s.gender}</p>
                <div class="flex items-center justify-between">
                <A href={`/${s.role === "ხელოსანი" ? "xelosani" : "damkveti"}/${s.profId}`} class="text-blue-500 hover:underline mt-2 block">
                  ნახე პროფილი
                </A> 
                    <div class="flex items-center">
                        <p class="text-md font-normal pr-2">შეფასება:</p>
                        <Index each={new Array(2)}>
                            {() => (
                                <div>
                                    <img src={fullStar}></img>
                                </div>
                            )}
                        </Index>
                        <Index each={new Array(5 - 2)}>
                            {() => (
                                <div>
                                    <img src={emptyStar}></img>
                                </div>
                            )}
                        </Index>
                    </div>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </For>
  </div>
</section>

    </div>
  );
};

export default Search;
