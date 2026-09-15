export function loginUser(payload?: any): Promise<any>;
export function registerUser(payload?: any): Promise<any>;

export function getProfile(): Promise<any>;
export function updateProfile(payload: any): Promise<any>;

export function getCompanies(): Promise<any[]>;

export function getPositions(payload?: any): Promise<any[]>;
export function getPositionById(positionId: string): Promise<any>;

export function getApplications(): Promise<any[]>;
export function createApplication(payload: any): Promise<any>;
export function updateApplication(applicationId: string, payload: any): Promise<any>;
export function updateApplicationStatus(applicationId: string, stage: string): Promise<any>;
export function deleteApplication(applicationId: string): Promise<any>;

export function getInterviews(): Promise<any[]>;
export function createInterview(payload: any): Promise<any>;
export function updateInterview(interviewId: string, payload: any): Promise<any>;
export function deleteInterview(interviewId: string): Promise<any>;

export function getDashboard(): Promise<any>;
export function getAnalytics(): Promise<any>;

export function isSavedPosition(positionId: string): Promise<boolean>;
export function toggleSavedPosition(positionId: string): Promise<{ saved: boolean }>;
