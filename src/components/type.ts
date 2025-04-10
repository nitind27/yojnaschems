
export type clusterdata = {
  cluster_id: number;
  cluster_name: string;
  status: string;
  ins_date_time: Date;

  update_date_time?: Date | null; // Nullable field
};

export type talukasdata = {
  id: bigint;
  name: String;
  name_marathi: String;
  status: String;
};

export type grampanchayat = {
  id: number;
  name: String;
  name_marathi: String;
  taluka_id: number;
  population: number;
  status: String;
};

export type Villages = {
  id: number;
  taluka_id: number;
  gp_id: number;
  name: string;
  name_marathi: string;
  total_population: number;
  trible_population: number;
  arthik_maryada: any; // Change this to Decimal
  village_type: string;
  status?: string;
  // created_at: Date;
  // updated_at?: Date | null;
};

export type Schooldata = {
  school_id: number;
  school_name: string;
  address: string;
  cluster_id: number; // Foreign key reference
  taluka_id: number; // Foreign key reference
  udias: string;
  stds: string;
  medium: string;
  email_id: string;
  mukhya_name: string;
  mukhya_contact: string;
  mukhya_email: string;
  purush_name: string;
  purush_contact: string;
  purush_email: string;
  stri_name: string;
  stri_contact: string;
  stri_email: string;
  status?: string; // Optional field
  ins_date_time: Date;
  school_name_mr: string;
  image_urls: string;
  pat_sankhya?: number | null;
  school_type: string;
  // cluster?: ClusterData; // Optional relationship
  // taluka?: TalukasData; // Optional relationship
};

export type Facility = {
  id: bigint; // Corresponds to BigInt in Prisma
  name: string; // Corresponds to String in Prisma
  status: string; // Corresponds to String in Prisma
  createdAt?: Date | null; // Nullable DateTime in Prisma
  updatedAt?: Date | null; // Nullable DateTime in Prisma
  // Corresponds to Int in Prisma
};
export type Representative = {
  id: bigint;
  name: string;
  status: string; // Change this to string if other values are allowed
  created_at?: Date | null;
  updated_at?: Date | null;
};

export type Supervisor = {
  sup_id: number;
  sup_name: string;
  sup_contact: string;
  sup_address: string;
  sup_password?: string;
  imei_number?: string;
  category_id: number;
  padnam_id: number;
  sup_status: string; // Only these two values are allowed
};
export type Padnam = {
  padnam_id: number; // Represents int(11)
  padnam: string; // Represents varchar(50)
  status: string; // Represents varchar(10) with default value 'Active'
};

export type UserCategory = {
  user_cat_id: number; // Represents int(11)
  category_name: string; // Represents varchar(20)
  status: string; // Represents varchar(10) with default value 'Active'
};

export type Bank = {
  id: number; // Represents int(11)
  name: string; // Represents varchar(100)
  account_no: string; // Represents varchar(100)
  yojana_year_id: number; // Represents int(11)
  amount: any; // Represents decimal(20,2)
  status: string; // Represents varchar(10) with default value 'Active'
  ins_date_time: Date; // Represents datetime
  update_date_time?: Date | null; // Represents datetime
};
export type YojanaYear = {
  yojana_year_id: any; // Represents int(11)
  yojana_year: any; // Represents varchar(20)
  is_delete: any; // Represents varchar(20) with default value 'No'
  year_status: any; // Represents varchar(10)
};
export type OpeningBalance = {
  open_bal_id: number; // Represents int(11)
  open_bal: any; // Change from number to Decimal
  year_id: number; // Represents int(11)
  status: string; // Represents varchar(10) with default value 'Active'
  ins_date_time: Date; // Represents datetime
  update_date_time: Date | null; // Allow null values
};
export type NidhiVitaran = {
  id: bigint;
  requirement_id: number;
  work_master_id: bigint;
  date?: Date | null; // Optional date
  installment: string;
  amount: number; // Corresponds to Float in Prisma
  photo: string;
  latitude: string;
  longitude: string;
  address: string;
  status: string; // Default is 'Active'
  created_at?: Date | null; // Optional timestamp
  updatedAt?: Date | null; // Optional timestamp
};

export type WorkMaster = {
  id: bigint;
  taluka_id: bigint;
  gp_id: bigint;
  village_id: bigint;
  facility_id: bigint;
  representative_id: bigint;
  representative_name: string;
  name: string;
  estimated_amount: number; // Using number for Float in TypeScript
  tantrik_manyata_amount: number; // Using number for Float in TypeScript
  photo: string;
  prashashakiya_manyata: string; // Limited to 5 characters
  prashashakiya_manyata_no: string;
  prashashakiya_manyata_date?: Date | null; // Optional date field
  prashashakiya_manyata_amount: number; // Using number for Float in TypeScript
  latitude: string;
  longitude: string;
  address: string;
  status: string; // Default is 'Active'
  created_at?: Date | null; // Optional date field
  updated_at?: Date | null; // Optional date field
};

export type Notificationdata = {
  notifi_id: number;
  notifications_type: string;
  details: string;
  links: string;
  new_icon: string;
  add_date: Date;
  header: string;
  img: string;
  status: string;
};

export interface StudentData {
  student_id: number;
  serial_number?: string | null;
  uid?: string | null;
  gr_no?: string | null;
  date_of_admision?: Date | null;
  year_add?: string | null;
  school_id?: number | null;
  admited_in_std?: number | null;
  current_std?: number | null;
  division?: string | null;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  date_of_birth?: Date | null;
  place_of_birth: string; // Required field
  gender?: string | null;
  height?: string | null;
  weight?: string | null;
  mother_name?: string | null;
  religion?: string | null;
  lang_id?: number | null;
  cast: string; // Required field
  address?: string | null;
  contact_no?: string | null;
  full_name?: string | null;
  user_id?: number | null;
  cluster_id?: number | null;
  dropout?: string | null;
  dropout_date_time?: Date | null;
  status: "Active" | string; // Assuming 'Active' is a default value but other values are possible.
  ins_date_time?: Date | null;
  update_date_time?: Date | null;
  students_id_saral?: string | null;
  type_of_students?: string | null;
  saral_id?: string | null;
  date_leave?: Date | null;
  remarks?: string | null;
  stream?: string | null;
  profile_photo?: string | null;
  photo_update_date_time?: Date | null;
  sickle_cell?: string | null;
  aadhaar?: string | null;
  sickle_report?: string | null;
}

export type Standarddata = {
  standard_id: number; // Corresponds to standard_id
  section_id: number; // Corresponds to section_id
  standard_name: string; // Corresponds to standard_name
  status: string; // Corresponds to status
  ins_date_time: Date; // Corresponds to ins_date_time
  update_date_time: Date;
};

export type Patsankhya = {
  pat_id: number; // Corresponds to pat_id
  school_id: number; // Corresponds to school_id
  standard_id: number; // Corresponds to standard_id
  sankhya: number; // Corresponds to sankhya
};

export type SubCategory = {
  sub_category_id: number;
  category_id: number;
  sub_category_name: string;
  yojana_year_id: number;
  bank_id: number;
  amount: string; // Use 'number' for decimal values in TypeScript
  status: string;
  created_at: Date; // Use 'Date' for datetime values in TypeScript
  updated_at?: Date | null; // Optional field
  for_app: string;
};

export type YojanaMaster = {
  yojana_id: number;
  category_id: number;
  sub_category_id: number;
  yojana_name: string;
  date_ins: Date; // Assuming you will handle this as a Date object
  uddesh_swarup: string;
  patrata: string;
  sampark: string;
  is_delete: string; // 'Yes' or 'No'
  status: string; // 'Active' or other statuses
  gat: string;
  yojana_year_id: number;
  yojana_type: string;
  amount: string; // This will be a decimal value
};

export type Categorys = {
  category_id: number; // Primary key as a number
  category_name: string; // Name of the category
  status: string; // Status of the category, e.g., 'Active'
  created_at: Date; // Timestamp for when the category was created
  updated_at?: Date | null; // Timestamp for when the category was last updated
  for_app: string; // Indicates if the category is for app use, e.g., 'Yes' or 'No'
};

export type TblYojanaType = {
  yojana_type_id: number; // Corresponds to Int
  category_id: number; // Corresponds to Int
  sub_category_id: number; // Corresponds to Int
  yojana_type: string; // Corresponds to String
  status: string; // Corresponds to String
  ins_date_time: Date; // Corresponds to DateTime
  update_date_time?: Date | null; // Corresponds to DateTime
};

export type YojanaMasterApp = {
  yojana_id: number; // Unique identifier for the scheme
  category_id: number; // ID for the category
  sub_category_id: number; // ID for the sub-category
  yojana_name: string; // Name of the scheme
  date_ins: Date; // Date of insertion
  uddesh_swarup: string; // Purpose of the scheme
  patrata: string; // Eligibility criteria
  sampark: string; // Contact information
  is_delete: string; // Deletion status (e.g., 'No' or 'Yes')
  status: string; // Current status (e.g., 'Active' or 'Inactive')
  gat: string; // Group information
  yojana_year_id: number; // ID for the year of the scheme
  yojna_img: string; // Image URL or path for the scheme
};

export type TblBeneficiary = {
  beneficiary_id: number;
  category_id: number;
  sub_category_id: number;
  yojana_year_id: number;
  yojana_type: string;
  yojana_id: number;
  taluka_id: number;
  gp_id: number;
  village_id: number;
  surname: string;
  firstname: string;
  middlename: string;
  fullname: string;
  gat_name: string;
  gat_certificate: string;
  member: number;
  caste_id: number;
  beneficiary_type: string;
  rashion_no: string;
  aadhar: string;
  mobile: string;
  bank_name: string;
  ifsc: string;
  ac_no: string;
  tot_finance: string; // Decimal in Prisma corresponds to number in TypeScript
  amount_paid: string;
  fourty: string; // 'Yes' or 'No'
  sixty: string; // 'Yes' or 'No'
  hundred: string; // 'Yes' or 'No'
  status: string; // Default is 'Active'
  date_ins: Date; // DateTime in Prisma corresponds to Date in TypeScript
  date_update?: Date | null; // DateTime in Prisma corresponds to Date in TypeScript
  organization: string;
  work_order_date?: Date | null; // Date type for work order date
};

export interface WorkMasterDemo {
  id: number;
  taluka_id?: number | null;
  gp_id?: number | null;
  village_id?: number | null;
  facility_id?: number | null;
  representative_id?: number | null;
  representative_name?: string | null;
  name?: string | null;
  estimated_amount?: number | null;
  tantrik_manyata_amount?: number | null;
  photo?: string | null;
  prashashakiya_manyata?: string | null;
  prashashakiya_manyata_no?: string | null;
  prashashakiya_manyata_date?: Date | null;
  prashashakiya_manyata_amount?: number | null;
  latitude?: string | null;
  longitude?: string | null;
  address?: string | null;
  status?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  estimatedtotalamount?: string | null;
  number_work?: number | null;
  genratedworkdate?: Date | null;
  generatednumber?: string | null;
  type?: string | null;
}

export type TblParivahanBeneficiary = {
  parivahan_id: number;
  parivahan_no: number;
  parivahan_date: Date; // or string if you're handling dates as strings
  outward_no: string;
  sup_id: number;
  yojana_year_id: number;
  yojana_type: string;
  yojana_id: number;
  beneficiary_id: string;
  installment: string;
  work_status: string; // Default is 'Pending'
  status: string; // Default is 'Active'
  ins_date: Date; // or string if you're handling dates as strings
};


export type tblparivahan = {
  parivahan_id: number;
  parivahan_no: bigint;
  parivahan_date: Date; // or string if you prefer to handle dates as strings
  outward_no: string;
  sup_id: number;
  yojana_year_id: number;
  yojana_type: string;
  yojana_id: number;
  beneficiary_id: string;
  status: string; // Default is 'Active'
  ins_date: Date; // or string if you prefer to handle dates as strings
};

export type TblUsers = {
  user_id: number;
  category_id: number;
  name: string;
  contact_no: string;
  email: string;
  address: string;
  username: string;
  password: string;
  status: string; // Default is 'Active'
  ins_date_time: Date; // Use Date for JavaScript date handling
  update_date_time: Date; // Use Date for JavaScript date handling
  school_id: number;
  standard_id: number;
  hostel_id: number;
  central_kitchan_id: number;
  civil_id: number;
  dept_id: number;
  lipik_id: number;
  officer_id: number;
  apo_id: number;
  cluster_id: number;
  padnam_id: number;
};

export type tblstudentsscholarship = {
  student_id: number;
  serial_number?: string | null;
  uid?: string | null;
  gr_no?: string | null;
  date_of_admision?: Date | null;
  year_add?: string | null;
  school_id?: number | null;
  admited_in_std?: number | null;
  current_std?: number | null;
  division?: string | null;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  date_of_birth?: Date | null;
  place_of_birth: string; // Not nullable
  gender?: string | null;
  height?: string | null;
  weight?: string | null;
  mother_name?: string | null;
  religion?: string | null;
  lang_id?: number | null;
  cast: string; // Not nullable
  address?: string | null;
  contact_no?: string | null;
  full_name?: string | null;
  user_id?: number | null;
  cluster_id?: number | null;
  dropout: any; // Assuming these are the only two values
  dropout_date_time?: Date | null;
  status: any; // Assuming these are the only two values
  ins_date_time?: Date | null;
  update_date_time?: Date | null;
  students_id_saral?: string | null;
  type_of_students?: string | null;
  saral_id?: string | null;
  date_leave?: Date | null;
  remarks?: string | null;
  stream?: string | null;
  profile_photo?: string | null;
  photo_update_date_time?: Date | null;
  sickle_cell?: string | null;
  aadhaar?: string | null;
  sickle_report?: string | null;
  scholarship_name?: string | null;
  student_scholarship_id?: string | null;
};

export type TblCaste = {
  caste_id: number;       // Corresponds to int(11)
  caste_name: string;     // Corresponds to varchar(50)
  status: 'Active' | string; // Corresponds to varchar(10) with default 'Active'
}



export type TblMembers = {
  member_id: number;
  beneficiary_id: number;
  surname: string;
  firstname: string;
  middlename: string;
  fullname: string;
  designation: string;
  caste_id: number;
  beneficiary_type: string;
  ration_no: string;
  aadhar_no: string;
  mobile_no: string;
  status?: any; // Assuming these are the only possible values
  ins_date_time?: Date; // Optional, as it defaults to now()
  update_date_time?: Date | null; // Can be null
};


export type Tblbankmaster = {
  id: number;
  talukaid?: number | null;
  bank_name?: string | null;
  ifsc_code?: string | null;
  status?: string | null;
};

export type TblSlider = {
  slider_id: number;
  slider_name: string;
  slider_img: string;
  img_type: string;
};


export type TblSports = {
  sports_id: number;
  sports_name: string;
  status: string;
  ins_date_time: Date;
  update_date_time: Date | null;
  icon: string;
  serial_number: number;
};

export type TblSportsInfoNew = {
  sports_info_id: number;
  sports_record: string;
  status: string;
  ins_date_time: Date;
  update_date_time: Date | null;

}


export type TblAchivments = {
  achivment_id: number;
  sports_id: number;
  student_id: number;
  standard_id: number;
  school_id: number;
  rank: string;
  competition_date: Date;
  levels: string;
  details: string;
  player_time: string;
  winning_time: string;
  state_level: string;
  status: string;
  ins_date_time: Date;
  update_date_time: Date | null;

}

export type TblEvaluation = {
  evaluation_id: number;
  parivahan_id: number;
  beneficiary_id: number;
  photo: string;
  remarks: string;
  other_remraks: string;
  lat: string;
  log: string;
  address: string;
  yojana_id: number;
  yojana_year_id: number;
  sub_category_id: number;
  category_id: number;
  yojana_type: number;
  ins_date_time: Date;
  update_date_time: Date | null;
  evaluation_status?: "Pending" | "Completed" | string;
  status?: "Active" | "Inactive" | string;
};


export type TblHostel = {
  hostel_id: number;
  aapar_aayukt: string;
  prakalp: string;
  hostel_name: string;
  hostel_type: string;
  address: string;
  cluster_id: number;
  taluka: string;
  dist: string;
  warden_name: string;
  hostel_darja: string;
  hostel_manjur_shkamata: string;
  hostel_imarat_shkamata: string;
  contact_no: string;
  email: string;
  status: string;
  image_urls: string;
}


export type MissionShikari = {
  id: number;
  designation?: string | null;
  studentname?: string | null;
  schoolhosteltype?: string | null;
  schoolhostelname?: string | null;
  subject?: string | null;
  testdate?: string | null;
  totalmarks?: string | null;
  obtainmarks?: string | null;
  percentage?: string | null;
  aadharcard?: string | null;
  parentsnumber?: string | null;
  imgupload?: string | null;
};


export type TblEvaluationAmount = {
  id: number;
  beneficiary_id: number;
  evaluation_id: number;
  amount: any;
  ins_date: Date;
  ins_date_time: Date;
  verification: any; // Assuming it can be "No" or "Yes"
  status: any;// Assuming possible values
};

export type Document = {
  document_id: number;
  document_name?: string | null;
  status?: string | null;
  ins_date_time: Date;
  update_date_time: Date;
};

export type DocumentYojana = {
  document_id: number;
  category_id?: number | null;
  subcategory_id?: number | null;
  documents?: string | null;
  yojana_id?: number | null;
  year_id?: string | null;
  yojna_name?: string | null;
  status?: string | null;
  ins_date_time: Date;
  update_date_time: Date;
};
