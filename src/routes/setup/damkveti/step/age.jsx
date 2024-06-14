import { createEffect, createSignal } from "solid-js";
import ChevronRightBlackSVG from "../../../../../public/svg-images/ChevronRightBlack.svg";
import ChevronLeftBlackSVG from "../../../../../public/svg-images/ChevronLeftBlack.svg";
import dropdownSVG from "../../../../../public/svg-images/svgexport-8.svg"

const Age = () => {
  const [currentDate, setCurrentDate] = createSignal(new Date());
  const [showYearDropdown, setShowYearDropdown] = createSignal(false);
  const [weeks, setWeeks] = createSignal();

  const georgianMonthNames = [
    "იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი",
    "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"
  ];

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  createEffect(() => {
    const year = currentDate().getFullYear();
    const month = currentDate().getMonth();
    const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);
    const newWeeks = [];
    let week = [];
    for (let i = 0; i < startDayOfMonth(year, month); i++) {
      week.push(null);
    }
    days.forEach((day) => {
      week.push(day);
      if (week.length === 7) {
        newWeeks.push(week);
        week = [];
      }
    });
    if (week.length) {
      while (week.length < 7) {
        week.push(null);
      }
      newWeeks.push(week);
    }
    setWeeks(newWeeks);
  });

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate());
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate());
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleYearDropdown = () => {
    setShowYearDropdown(!showYearDropdown());
  };

  const handleYearSelect = (year) => {
    const newDate = new Date(currentDate());
    newDate.setFullYear(year);
    setCurrentDate(newDate);
    setShowYearDropdown(false);
  };

  const yearOptions = Array.from({ length: 90 }, (_, i) => new Date().getFullYear() - 90 + i).reverse();

  const isFutureDate = (day) => {
    const today = new Date();
    const dateToCheck = new Date(currentDate().getFullYear(), currentDate().getMonth(), day);
    return dateToCheck > today;
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-[328px] flex flex-col justify-between h-[400px] p-3 border border-gray-300 rounded-2xl">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center justify-between w-full gap-8 border border-gray-300 rounded-md py-0.5 px-0.5 text-xs font-medium text-gray-900">
            <button
              onClick={handlePrevMonth}
              className="text-gray-900 p-2 rounded-md cursor-pointer transition-all duration-500 hover:bg-green-100 hover:text-dark-green"
            >
              <img src={ChevronLeftBlackSVG} height={16} width={16}></img>
            </button>
            {georgianMonthNames[currentDate().getMonth()]}
            <button
              onClick={handleNextMonth}
              className="text-gray-900 p-2 rounded-md cursor-pointer transition-all duration-500 hover:bg-green-100 hover:text-dark-green"
              disabled={new Date(currentDate().getFullYear(), currentDate().getMonth() + 1, 1) > new Date()}
            >
              <img src={ChevronRightBlackSVG} height={16} width={16}></img>
            </button>
          </div>
          <div className="relative">
            <button
              onClick={handleYearDropdown}
              className="flex font-[medium-font] font-bold items-center gap-1.5 px-5 py-2.5 rounded-md border border-gray-300 text-xs text-gray-900 transition-all duration-500 hover:bg-green-100 hover:text-dark-green"
            >
              <p className="font-[normal-font]">{currentDate().getFullYear()}</p>
              <img src={dropdownSVG} width={16} height={16}></img>
            </button>
            {showYearDropdown() && (
              <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                {yearOptions.map((yearOption) => (
                  <div
                    key={yearOption}
                    onClick={() => handleYearSelect(yearOption)}
                    className="px-4 py-2 text-xs font-medium text-gray-900 hover:bg-green-100 hover:text-dark-green cursor-pointer"
                  >
                    {yearOption}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {weeks() && <table className="pb-3 border-b border-gray-300 mx-auto">
          <thead className="mb-2">
            <tr className="flex">
              {['ორშ', 'სამშ', 'ოთხშ', 'ხუთშ', 'პარ', 'შაბ', 'კვირ'].map((day) => (
                <td key={day} className="flex items-center justify-center w-10 h-10">
                  <p className="font-bold font-[thin-font] text-xs text-gray-900 rounded-full flex items-center justify-center w-full h-full">
                    {day}
                  </p>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
              {weeks().map((week, weekIndex) => (
                <tr key={weekIndex} className="flex">
                  {week.map((day, dayIndex) => (
                    <td key={dayIndex} className="flex items-center justify-center w-10 h-10">
                      <p
                        className={`text-sm font-medium ${day ? (isFutureDate(day) ? 'text-gray-300' : 'text-gray-900') : 'text-gray-300'
                          } rounded-full flex  font-[normal-font] font-bold text-xs items-center justify-center w-full h-full transition-all duration-300 ${day && !isFutureDate(day) ? 'cursor-pointer hover:bg-green-100 hover:text-dark-green' : ''
                          }`}
                        style={{ pointerEvents: day && isFutureDate(day) ? 'none' : 'cursor-pointer' }}
                      >
                        {day}
                      </p>
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>}
        
        <button className="py-2 mt-3 w-full px-3 rounded-md text-sm font-[thin-font] font-bold bg-dark-green text-white transition-all duration-500 hover:bg-dark-green-hover">
          გაგრძელება
        </button>
      </div>
    </div>
  );
};

export default Age;
