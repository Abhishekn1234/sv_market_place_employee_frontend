"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as React from "react";

export type CommonTab = {
  value: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
};

interface Props<T extends string> {
  tabs: CommonTab[];
  activeTab: T;
  setActiveTab: (tab: T) => void; // <- use generic
  isRTL?: boolean;
}

export default function CommonTabs<T extends string>({ tabs, activeTab, setActiveTab, isRTL = false }: Props<T>) {
  const tabTriggerClass = `
    relative h-12 px-0 bg-transparent rounded-none
    text-gray-600 shadow-none
    focus:outline-none focus-visible:ring-0
    after:absolute after:left-0 after:bottom-0
    after:h-[2px] after:w-full after:bg-blue-600
    after:scale-x-0 after:origin-left
    after:transition-transform after:duration-200
    data-[state=active]:text-blue-600
    data-[state=active]:after:scale-x-100
    hover:text-blue-600
  `;

  return (
    <Tabs value={activeTab}  onValueChange={(v) => setActiveTab(v as T)} className="w-full">
      <div className="sticky top-0 z-10">
        <TabsList
          className={`h-12 w-full gap-6 bg-transparent p-0 border-none shadow-none ${
            isRTL ? "justify-end flex-row-reverse" : "justify-start"
          }`}
        >
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className={tabTriggerClass}>
              {tab.icon && <span className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"} inline-block`}>{tab.icon}</span>}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div className="p-3 md:p-4">
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="m-0">
            {tab.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
