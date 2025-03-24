export type TClinic = {
    id: number;
    created_on: string;
    name: string;
    logo?: string;
    is_referral_allowed?: number;
    accepts_referral?: number;
};

export type ClinicModel = {
    id: number;
    created_on: string;
    name: string;
    logo?: string;
    is_referral_allowed?: number;
    accepts_referral?: number;
};

export type TBranch = {
    id: number;
    created_on: string;
    name: string;
    contact: string;
    alternate_contact?: string;
    address?: string;
    online_booking_enabled?: number;
    city?: string;
    locality?: string;
    state?: string;
    pincode?: string;
    clinic_logo?: string;
    logo?: string;
};

export type BranchModel = {
    id: number;
    created_on: string;
    name: string;
    contact: string;
    alternate_contact?: string;
    address?: string;
    online_booking_enabled?: number;
    city?: string;
    locality?: string;
    state?: string;
    pincode?: string;
    clinic_logo?: string;
    logo?: string;
};

export type TSpecialty = {
    id: number;
    created_on: string;
    name: string;
};

export type TRate = {
    assessment_type: string;
    charge: number;
    specialty: number;
    specialty_name?: string;
    clinic?: number;
    clinic_name: string;
    branch?: number;
    branch_name?: string;
    becc_share?: number;
    smh_share?: number;
    anand_share?: number;
    mnh_share?: number;
    expert_share?: number;
    created_by_name?: string;
    created_on?: string;
    id: number;
};

export type TDesignation = {
    id: number;
    created_on: string;
    name: string;
};

export type TEmployee = {
    id: number;
    created_on: string;
    created_by: number;
    role: number;
    role_name: string;
    name: string;
    branches: TBranch[];
    designation: number;
    email: string;
    mobile: string;
    alternate_mobile: string;
    emergency_contact: string;
    alt_emergency_contact: string;
    dob: string;
    address: string;
    doj: string;
    employee_id: string;
    qualification: string;
    rci: string;
    basic_salary: number;
    pf: number;
    hra: number;
    image?: string;
    signature?: string;
    branch_name: string;
    designation_name: string;
    created_by_name: string;
    updated_by_name?: string;
    clearance?: string;
    bank_ifsc?: string;
    bank_account?: string;
};

export type TPackage = {
    name: string;
    total_amount: number;
    clinic: number;
    created_by: number;
    created_by_name: string;
    created_on: string;
    id: number;
};

export type TPackageItem = {
    package: number;
    specialty: number;
    specialty_name: string;
    item: number;
    clinic: number;
    clinic_name: string;
    created_on: string;
    created_by: number;
    assessment_type: string;
    charge: number;
    created_by_name: string;
};

export type TPatient = {
    id: number;
    created_on: string;
    name: string;
    gender: "male" | "female" | "other";
    contact: string;
    email: string;
    dob: string;
    address: string;
    country: string;
    country_code: string;
    city: string;
    state: string;
    state_code: string;
    source: "clinic" | "app";
    image: string;
    clinic_name: string;
    referred_from: string;
};

export type TInventory = {
    id: number;
    serial_number: string;
    created_on: string;
    created_by: number;
    name: string;
    model?: number;
    purchase_price: number;
    quantity: number;
    mrp: number;
    brand: number;
    transferred_on?: string;
    transferred_by_name?: string;
    branch?: number;
    branch_name?: string;
    manufactured_on: string;
    description: string;
    status: string;
    purchased_on: string;
    image?: string;
    created_by_name: string;
    updated_by_name?: string;
    model_name?: string;
    brand_name?: string;
    item_type?: string;
};

export type TInventoryPackKit = {
    id: number;
    clinic: number;
    branch?: number;
    name: string;
    serial_number: string;
    brand: number;
    model: number;
    status: string;
    purchase_price: number;
    mrp: number;
    manufactured_on?: string;
    purchased_on?: string;
    transferred_on?: string;
    transferred_by?: number;
    created_on: string;
    created_by: number;
    model_name: string;
    brand_name: string;
    branch_name: string;
    transferred_by_name: string;
    created_by_name: string;
    item_type?: string;
};
export type TInventoryKit = {
    id: number;
    clinic: number;
    branch?: number;
    name: string;
    serial_number: string;
    brand: number;
    model: number;
    status: string;
    purchase_price: number;
    mrp: number;
    manufactured_on?: string;
    purchased_on?: string;
    transferred_on?: string;
    transferred_by?: number;
    created_on: string;
    created_by: number;
    model_name: string;
    brand_name: string;
    branch_name: string;
    transferred_by_name: string;
    created_by_name: string;
    item_type?: string;
};

export type TAudioFiles = {
    briefHistory?: string;
    diagnosis?: string;
    tympanometry?: string;
    otoacousticMeasurements?: string;
    auditoryBrainstemResponse?: string;
    otherTests?: string;
    lateLatencyResponse?: string;
    mismatchNegativity?: string;
    p300Response?: string;
    centralAuditoryTests?: string;
    vestibularAssessment?: string;
    amplificationAssessment?: string;
};
export type TAudioReportData = {
    ear: "left" | "right";
    data: {
        degree: string;
        configuration: string;
        type: string;
    };
};

export type TEarReportData = {
    ear: "left" | "right";
    degree: string;
    configuration: string;
    type: string;
    reflex: string;
    reflexIPSI: string;
    reflexCONTRA: string;
    ipsi: string;
    problemType: string;
};

export type TReportData = {
    left: TEarReportData;
    right: TEarReportData;
};

export type TPackKitItem = {
    id: number;
    serial_number?: string;
    name?: string;
    pack?: number;
    kit?: number;
    files?: TAudioFiles;
};

export type TBrand = {
    id: number;
    name: string;
    clinic: number;
    created_on: string;
    created_by: number;
    created_by_name: string;
};

export type TModel = {
    id: number;
    created_on: string;
    created_by: number;
    brand: number;
    brand_name: string;
    name: string;
    clinic: number;
    created_by_name: string;
};

export type TInventoryItem = {
    id?: number;
    kit?: number;
    name?: string;
    serial_number?: string;
};

export type TInventoryRequest = {
    id: number;
    description?: string;
    model: number;
    brand: number;
    quantity: number;
    clinic: number;
    branch: number;
    status?: string;
    created_on: string;
    created_by: number;
    model_name: string;
    brand_name: string;
    branch_name: string;
    created_by_name: string;
};

export type TInventoryCumulative = {
    count: number;
    name?: string;
    brand_name: string;
    model: number;
    model_name: string;
    branch_name?: string;
};

export type TNotification = {
    id: number;
    title: string;
    description: string;
    type: string;
    redirect_to?: string;
    is_viewed: number;
    created_on: string;
};

export type TReferral = {
    id: number;
    patient: number;
    patientName: string;
    gender: string;
    contact: string;
    referredClinicName: string;
    referredFromName: string;
    reason: string;
    createdOn: string;
};

export type TAppointment = {
    appointment_for: number;
    appointment_for_name: string;
    rci: string;
    branch: number;
    branch_address: string;
    branch_contact: string;
    branch_name: string;
    charge: number;
    clinic: number;
    clinic_name: string;
    created_on: string;
    date: string;
    designation: string;
    discount: number;
    id: number;
    logo: string;
    patient: number;
    patient_mobile: string;
    patient_name: string;
    patient_gender: string;
    patient_dob: string;
    payable_amount: number;
    slot_end_time: string;
    slot_start_time: string;
    source: string;
    signature?: string;
    specialty: number;
    specialty_name: string;
    status: string;
    is_bill_generated: 0 | 1;
    reason: string;
};

export type TProcedure = {
    rate: number;
    charge: number;
    quantity: number;
    discount: number;
};

export type TAvailability = {
    id: number;
    specialty: number;
    specialty_name: string;
    branch?: number;
    appointment_for: number;
    appointment_for_name: string;
    branch_name?: string;
    clinic: number;
    clinic_name: string;
    day: number;
    start_time: string;
    end_time: string;
    created_on: string;
    created_by: number;
};

export type TState = {
    id: number;
    name: string;
    capital: string;
};

export type TRole = {
    id: number;
    name: string;
    created_on: string;
};

export type THoliday = {
    list: never[];
    id: number;
    created_on: string;
    created_by: number;
    clinic: number;
    name: string;
    date: string;
    event_type?: string;
    clinic_name: string;
    created_by_name: string;
};
export type THolidayResponse = {
    success: boolean;
    result: {
        count: number,
        list: THoliday[]
    }
}

export type TPayslip = {
    id: number;
    created_on: string;
    created_by: number;
    clinic: number;
    employee: number;
    date: string;
    basic_salary: number;
    pf: number;
    conveyance: number;
    hra: number;
    ta: number;
    lwp: number;
    lop: number;
    net_salary: number;
    deduction: number;
    deduction_remark: string;
    bonus: number;
    bonus_remark: string;
    clinic_name: string;
    logo?: string;
    branch_name: string;
    branch_contact: string;
    branch_locality: string;
    branch_city: string;
    branch_state: string;
    branch_pincode: string;
    designation_name: string;
    employee_id: string;
    employee_name: string;
    doj: string;
    created_by_name: string;
    department: string;
    address: string;
    email: string;
    bank_account: string;
    bank_ifsc: string;
    std_days: number;
    worked_days: number;
};

export type TAttendance = {
    id: number;
    branch: number;
    branch_name: string;
    hours: number;
    employee: number;
    date: string;
    in_time: string;
    out_time: string;
};

export type TAttendanceStat = {
    patientId: number;
    patient_name: string;
    cancelled: number;
    completed: number;
    confirmed: number;
}
export type TEmployeeAttendance = {
    employee_id: number;
    employee_name: string;
    days: number;
    hours: number;
    attendance: TAttendance[];
};

export type TAppointmentShort = {
    appointment_for_name: string;
    charge: number;
    clinic_name: string;
    clinic_address: string;
    clinic_contact: string;
    clinic_logo: string;
    branch_logo: string;
    branch_address: string;
    branch_city: string;
    branch_pincode: string;
    branch_state: string;
    appt_branch: number;
    date: string;
    id: number;
    patient_id: number;
    patient_contact: string;
    patient_email: string;
    patient_gender: string;
    patient_name: string;
    patient_dob: string;
    slot_end_time: string;
    slot_start_time: string;
    payment_location: number;
    payment_location_name: string;
};

export type TService = {
    appointment: number;
    assessment_type: string;
    charge: number;
    created_by?: number;
    created_on?: string;
    id: number;
    quantity: number;
    rate: number;
    sub_total: number;
};

export type TServiceShort = {
    assessment_type: string;
    charge: number;
    created_on: string;
    id: number;
    quantity: number;
    sub_total: number;
    discount: number;
};

export type TBill = {
    id: number;
    appointment: number;
    appointment_data: TAppointmentShort;
    services: TServiceShort[];
    branch: number;
    clinic: number;
    created_by_name: string;
    created_on: string;
    discount_amount: number;
    cash_amount: number;
    card_amount: number;
    upi_amount: number;
    branch_name: string;
    clinic_name: string;
    payable_amount: number;
    payment_mode: string;
    total_amount: number;
};

export type TLeave = {
    branch: number;
    branch_name: string;
    clinic: number;
    clinic_name: string;
    date?: string;
    created_on: string;
    employee: number;
    employee_name: string;
    id: number;
    status: string;
    total_days: number;
    days: string[];
    reason: string;
    rejection_reason: string;
};

export type TMetadata = {
    states: TState[];
    clinics: TClinic[];
    roles: TRole[];
};

export type TCharge = {
    id: number;
    created_on: string;
    specialty: number;
    specialty_name: string;
    appointment_for: number;
    appointment_for_name: string;
    clinic: number;
    clinic_name: string;
    charge: number;
    created_by: number;
    created_by_name: string;
    designation: string;
};

export type TWorkflow = {
    id: number;
    patient: number;
    service: number;
    service_name: string;
    clinic: number;
    branch: number;
    patient_name: string;
    patient_gender: string;
    clinic_name: string;
    branch_name: string;
    created_by_name: string;
    report_generated: 1 | 0;
    completed_on?: string;
    status: string;
};

export type TShortData = {
    id: number;
    name: string;
    type?: string;
    _id?: string;
};

export type TAssessment = {
    appointment: number;
    branch: { id: number; name: string };
    clinic: { id: number; name: string };
    created_by: { id: number; name: string };
    created_date: string;
    form: { _id: string; name: string };
    patient: { id: number; name: string };
    specialist: { id: number; name: string };
    specialty: { id: number; name: string };
    _id: string;
    is_report_generated?: boolean;
    sections?: TAssessmentSection[];
    type: string;
};

export type TAssessmentSection = {
    title: string;
    questions: TAssessmentQuestion[];
};

export type TAssessmentQuestion = {
    question: string;
    type: "mcq" | "text";
    isMultiple: boolean;
    options: TAssessmentOption[];
    answers?: string[];
};

export type TAssessmentOption = {
    value: string;
};

export type TReport = {
    address: string;
    appointment: number;
    appointment_date: string;
    appointment_for: number;
    appointment_for_name: string;
    assessment: string;
    booked_on: string;
    clinic_name: string;
    created_on: string;
    id: number;
    logo: string;
    branch_logo: string;
    patient: number;
    patient_mobile: string;
    patient_name: string;
    report: string;
    slot_end_time: string;
    slot_start_time: string;
};

export type TFile = {
    created_by?: number;
    created_on?: string;
    id: number;
    url: string;
    file_name: string;
    file_type: string;
};

export type TTarget = {
    id: number;
    specialist: number;
    name: string;
    designation: string;
    clinic: number;
    month: number;
    year: number;
    total_points: number;
    total_points_acquired: number;
    created_on: string;
    target?: string;
    sl_no?: string;
    status?: string;
    points?: string;
};

export type TTargetItem = {
    id: number;
    target: number;
    description: string;
    points: number;
    points_acquired: number;
    remarks?: string;
    file?: string;
    status?: string;
};
export type SpecialistData = {
    id?: number;
    specialist?: number;
    name?: string;
    designation?: string;
    month?: number;
    year?: number;
    total_points?: number;
    total_points_acquired?: number;
    created_on?: string;
};
export type TLessonPlan = {
    id?: number;
    patient?: number;
    specialist?: number;
    clinic?: number;
    created_on?: string;
    patient_name?: string;
    specialist_name?: string;
    designation_name?: string;
};

export type TLessonPlanItem = {
    id?: number;
    lesson_plan?: number;
    domain?: string;
    description?: string;
    status?: string;
};

export type TSchedule = {
    id: number;
    specialty: number;
    specialty_name: string;
    branch?: number;
    appointment_for: number;
    appointment_for_name: string;
    branch_name?: string;
    clinic: number;
    clinic_name: string;
    day: number;
    start_time: string;
    end_time: string;
    created_on: string;
    created_by: number;
};

export type TAssessmentBody = {
    basicaudio?: {
        rate_id: number;
        assessment_type: string;
        service_count: number;
        charge: number;
        total_charge: number;
    };
    audiose?: {
        rate_id: number;
        assessment_type: string;
        service_count: number;
        charge: number;
        total_charge: number;
    };
    campaudio?: {
        rate_id: number;
        assessment_type: string;
        service_count: number;
        charge: number;
        total_charge: number;
    };
    audio?: {
        rate_id: number;
        assessment_type: string;
        service_count: number;
        charge: number;
        total_charge: number;
    };
    audio_evl?: {
        rate_id: number;
        assessment_type: string;
        service_count: number;
        charge: number;
        total_charge: number;
    };
};

export type SubSectionModel = {
    description: string;
    status?: number;
};

export type DomainSectionModel = {
    name?: string;
    points?: number | string;
    subSections: SubSectionModel[];
};

export type DomainModel = {
    name: string;
    sections: DomainSectionModel[];
};

export type GoalFormModel = {
    _id: string;
    type: string;
    name: string;
    clinic: TShortData;
    specialty: TShortData;
    domains: DomainModel[];
    created_date: string;
    created_by: TShortData;
};

export type GoalModel = {
    _id: string;
    goalId?: string;
    form: TShortData;
    domains: DomainModel[];
    clinic: TShortData;
    specialty: TShortData;
    patient: TShortData;
    specialist: TShortData;
    created_date: string;
    points: [string, number][];
};

export type TTimeTable = {
    branch: number;
    branchName: string;
    clinic: number;
    createdBy: number;
    createdOn: string;
    id: number;
    paidAmount: number;
    patient: number;
    patientName: string;
    pricePerSession: number;
    sessionsPerWeek: number;
    specialist: number;
    specialistName: string;
    startDate: string;
    totalMonths: number;
    totalPrice: number;
};

export type TTimeTableGetById = {
    dates: {
        date: string;
    }[];

    days: {
        day: number;
        sessionStartTime: string;
        sessionEndTime: string;
    }[];
    timeTable: TTimeTable;
};

export type TResult =
    | TPackKitItem
    | TBrand
    | TModel
    | TInventoryPackKit
    | TInventory
    | TBranch
    | TInventoryCumulative
    | TNotification
    | TReferral
    | TSpecialty
    | TEmployee
    | TRate
    | TPackage
    | TPackageItem
    | TMetadata
    | TDesignation
    | TRole
    | THoliday
    | TPayslip
    | TEmployeeAttendance
    | TAttendance
    | TBill
    | TLeave
    | TCharge
    | TAvailability
    | TWorkflow
    | TService
    | TAssessment
    | TReport
    | TFile
    | TBill
    | TTarget
    | TTargetItem
    | SpecialistData
    | TLessonPlan
    | TLessonPlan
    | TAssessmentBody
    | TSchedule
    | TAssessmentBody
    | TTimeTable;

export type TListResult<T> = {
    count?: number;
    list: T[];
};

export interface ApiResponse<T> {
    success: boolean;
    result?: {
        count?: number;
        list: T[];
    };
    message?: string;
}

export type ApiCountResponse = {
    success: boolean;
    count: number;
};

export interface ApiSingleResponse<T> {
    success: boolean;
    result: T;
}

export type TApiResponse<T> = {
    success: boolean;
    result?: T;
    message?: string;
    clinic_share?: number;
    rudh_share?: number;
    total_charge?: number;
    rudh_amt_collected?: number;
    clinic_amt_collected?: number;
};

export type TApiCountResponse = {
    success: boolean;
    count: number;
};

export type TApiSingleResponse<T> = {
    success: boolean;
    message?: string;
    result: T;
};

export type BeccResponse = {
    becc_share: number;
    rudh_share: number;
    total_charge: number;
};

export interface SMHInvoice {
    clinic_share: number;
    rudh_share: number;
    total_charge: number;
}

export interface SMHPatient {
    patient_id: number;
    patient_name: string;
    rate_card_name: string;
    appt_date: string;
    smh_share: number;
    rudh_share: number;
    smh_charge: number;
    rudh_charge: number;
    rate: number;
    appointment_year: number;
    appointment_month: number;
}

// Define the main response type
export interface FetchSMHInvoicesResponse {
    invoice: SMHInvoice;
    patient_list: SMHPatient[];
    success: boolean;
}

export type PatientInvoice = {
    patient_name?: string;
    assessment_type?: string;
    total?: number;
    becc_share?: number;
    rudh_share?: number;
    becc_charge?: number;
    rudh_charge?: number;
};

export type BeccInvoiceResponse = {
    becc_share?: number;
    rudh_share?: number;
    total_charge?: number;
    list?: PatientInvoice[];
};
export type BeccInvoice = {
    becc_share?: number;
    rudh_share?: number;
    total_charge?: number;
    rudh_amt_collected?: number;
    becc_amt_collected?: number;
};
