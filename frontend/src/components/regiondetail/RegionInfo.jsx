import React, { useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDownIcon } from '@radix-ui/react-icons';

const RegionInfo = () => {
  const { isEnglish } = useLanguage();
  const [openSections, setOpenSections] = useState({
    demographic: false,
    population: false,
    economy: false,
    employment: false,
  });

  return (
    <div className="w-1/5 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {isEnglish === "EN" ? "Regional Statistics" : "რეგიონული სტატისტიკა"}
      </h2>

      <div className="space-y-3">
        {/* Demographic Processes Section */}
        <Collapsible.Root 
          open={openSections.demographic} 
          onOpenChange={(open) => setOpenSections(prev => ({ ...prev, demographic: open }))}
        >
          <div className="border-b pb-2 mb-3">
            <Collapsible.Trigger className="w-full text-left text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-between">
              <span>{isEnglish === "EN" ? "Demographic Processes" : "რევნოათული სტატისტიკა"}</span>
              <ChevronDownIcon 
                className={`w-4 h-4 transform transition-transform duration-200 ${openSections.demographic ? 'rotate-180' : ''}`}
              />
            </Collapsible.Trigger>
          </div>

          <Collapsible.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
            <div className="space-y-2 mb-4">
              <button className="w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1">
                {isEnglish === "EN" ? "Population Statistics" : "მოსახლეობა ონმეორმენია"}
              </button>
              
              <button className="w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1">
                {isEnglish === "EN" ? "Regional Performance" : "რეგიონის ფართოები"}
              </button>

              <button className="w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1">
                {isEnglish === "EN" ? "Births, Deaths and Natural Growth" : "შვილვამოვლითენებებო, ქალებვების და სოლვების რაოდენობა"}
              </button>

              <div className="border-l-2 border-blue-200 pl-3 space-y-2">
                <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                  {isEnglish === "EN" ? "2024 Municipal Birth Statistics" : "საქართვეოს 2024 წლის მოსახლეობის ადენობი"}
                </button>
                
                <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                  {isEnglish === "EN" ? "Migration Data" : "ფინანსური შედეგები"}
                </button>

                <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                  {isEnglish === "EN" ? "Population Distribution by Gender and Age" : "მოსახლეობის რიცხოვნობა სქესით და გარსის მიხედვა-ანალიტლების მიხედვით"}
                </button>

                <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                  {isEnglish === "EN" ? "Population Distribution by Regions" : "მოსახლეობის რიცხოვნობა რეგიონის მიხედვით"}
                </button>
              </div>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>

        {/* Population Section */}
        <Collapsible.Root 
          open={openSections.population} 
          onOpenChange={(open) => setOpenSections(prev => ({ ...prev, population: open }))}
        >
          <div className="border-b pb-2 mt-4">
            <Collapsible.Trigger className="w-full text-left text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-between">
              <span>{isEnglish === "EN" ? "Population" : "მოსახლეობა"}</span>
              <ChevronDownIcon 
                className={`w-4 h-4 transform transition-transform duration-200 ${openSections.population ? 'rotate-180' : ''}`}
              />
            </Collapsible.Trigger>
          </div>

          <Collapsible.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
            <div className="space-y-2 mb-4">
              <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                {isEnglish === "EN" ? "Population Distribution by Gender and Age Groups" : "მოსახლეობის რიცხოვნობა სქესით და გარის-სიმფლების მიხედვით 1 იანვრის მდგომარეობით"}
              </button>

              <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                {isEnglish === "EN" ? "Population by Employment Status" : "სამუშაო დასაქმებული მერხიხები მოსახლეობის წილი შვრმადალის შინაარსი ძირისმოსცხების (%)"}
              </button>

              <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                {isEnglish === "EN" ? "Population Living Standard Index" : "მოსახლეობის სიმჟღვრეა 1 კაცზე"}
              </button>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>

        {/* Economy Section */}
        <Collapsible.Root 
          open={openSections.economy} 
          onOpenChange={(open) => setOpenSections(prev => ({ ...prev, economy: open }))}
        >
          <div className="border-b pb-2 mt-4">
            <Collapsible.Trigger className="w-full text-left text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-between">
              <span>{isEnglish === "EN" ? "Economy" : "ლმწრავება"}</span>
              <ChevronDownIcon 
                className={`w-4 h-4 transform transition-transform duration-200 ${openSections.economy ? 'rotate-180' : ''}`}
              />
            </Collapsible.Trigger>
          </div>

          <Collapsible.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
            <div className="space-y-2 mb-4">
              <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                {isEnglish === "EN" ? "GDP and Economic Development" : "მთს და დასტიხელი ლაორული"}
              </button>

              <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                {isEnglish === "EN" ? "Foreign Trade Relations" : "პირდაპირი უცენაბი ინვესტიციები"}
              </button>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>

        {/* Employment Section */}
        <Collapsible.Root 
          open={openSections.employment} 
          onOpenChange={(open) => setOpenSections(prev => ({ ...prev, employment: open }))}
        >
          <div className="border-b pb-2 mt-4">
            <Collapsible.Trigger className="w-full text-left text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-between">
              <span>{isEnglish === "EN" ? "Employment and Income" : "დასაქმება და ხელფასები"}</span>
              <ChevronDownIcon 
                className={`w-4 h-4 transform transition-transform duration-200 ${openSections.employment ? 'rotate-180' : ''}`}
              />
            </Collapsible.Trigger>
          </div>

          <Collapsible.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
            <div className="space-y-2 mb-4">
              <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                {isEnglish === "EN" ? "Employment Statistics" : "დასაქმების სტატისტიკა"}
              </button>

              <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                {isEnglish === "EN" ? "Average Salary Data" : "საშუალო ხელფასის მონაცემები"}
              </button>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    </div>
  );
};

export default RegionInfo;
