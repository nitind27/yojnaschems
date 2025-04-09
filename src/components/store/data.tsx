// "use client";
// import React, { createContext, useContext, useState, ReactNode } from "react";
// // import { IServiceIdData } from "@/api/services/types";

// interface ContextProps {
//   items: IServiceIdData;
//   setItems: React.Dispatch<React.SetStateAction<IServiceIdData>>;
// }

// const defaultServiceIdData: IServiceIdData = {
//   title: "",
//   price: 0,
//   duration: "",
//   discount: 0,
//   discount_from: "",
//   discount_to: "",
//   type: "",
//   advanced_payment: "",
//   offering: {},
//   require: {},
//   promote: "",
//   parent_skills_id: "",
//   child_skills_ids: [],
//   parent_skills_label:"",
//   child_skills_labels:[],
// };

// const Context = createContext<ContextProps>({
//   items: defaultServiceIdData,
//   setItems: () => {},
// });

// export const ServiceProvider = ({ children }: { children: ReactNode }) => {
//   const [items, setItems] = useState<IServiceIdData>(defaultServiceIdData);

//   return (
//     <Context.Provider value={{ items, setItems }}>
//       {children}
//     </Context.Provider>
//   );
// };
// export const useServiceData = (): ContextProps => {
//   return useContext(Context);
// };