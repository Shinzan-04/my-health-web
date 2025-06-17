
import axios, { AxiosRequestHeaders } from "axios";

export default class ApiService {
  static BASE_URL: string = "http://localhost:8080";

static getHeader() {
  const authData = localStorage.getItem("authData");
  try {
    const parsed = JSON.parse(authData || "{}");
    const token = parsed?.token;

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  } catch (err) {
    console.error("Lỗi khi đọc token từ localStorage:", err);
    return {
      "Content-Type": "application/json",
    };
  }
}


  /** ---------------- AUTHENTICATION ---------------- */
  static async registerUser(data: any): Promise<any> {
    return (await axios.post(`${this.BASE_URL}/api/register`, data)).data;
  }

  static async loginUser(data: any): Promise<any> {
    return (await axios.post(`${this.BASE_URL}/api/login`, data)).data;
  }
/** ---------------- TEST RESULT ---------------- */
static getAuthHeader() {
  const authData = localStorage.getItem("authData");
  try {
    const parsed = JSON.parse(authData || "{}");
    const token = parsed?.token;

    if (!token) throw new Error("Token not found");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  } catch (err) {
    console.error("❌ Token không hợp lệ:", err);
    return {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
}

static async getTestResults(): Promise<any> {
  return (
    await axios.get(`${this.BASE_URL}/api/test-results`, this.getAuthHeader())
  ).data;
}

static async getTestResultById(id: number): Promise<any> {
  return (
    await axios.get(`${this.BASE_URL}/api/test-results/${id}`, this.getAuthHeader())
  ).data;
}

static async createTestResult(data: any): Promise<any> {
  return (
    await axios.post(`${this.BASE_URL}/api/test-results`, data, this.getAuthHeader())
  ).data;
}

static async updateTestResult(id: number, data: any): Promise<any> {
  return (
    await axios.put(`${this.BASE_URL}/api/test-results/${id}`, data, this.getAuthHeader())
  ).data;
}

static async deleteTestResult(id: number): Promise<any> {
  return (
    await axios.delete(`${this.BASE_URL}/api/test-results/${id}`, this.getAuthHeader())
  ).data;
}

  /** ---------------- SCHEDULE ---------------- */
  static async getSchedules(): Promise<any> {
    return (await axios.get(`${this.BASE_URL}/api/schedules`)).data;
  }

  static async getScheduleById(id: number): Promise<any> {
    return (await axios.get(`${this.BASE_URL}/api/schedules/${id}`)).data;
  }

  static async getSchedulesByDoctor(doctorId: number): Promise<any> {
    const authData = localStorage.getItem("authData");
    const token = authData ? JSON.parse(authData).token : null;

    if (!token) {
      throw new Error("Token không tồn tại.");
    }

    return (
      await axios.get(`${this.BASE_URL}/api/schedules/doctor/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).data;
    return (await axios.get(`${this.BASE_URL}/api/schedules/doctor/${doctorId}`)).data;
  }

  static async createSchedule(data: any): Promise<any> {
    return (await axios.post(`${this.BASE_URL}/api/schedules`, data)).data;
  }

  static async updateSchedule(id: number, data: any): Promise<any> {
    return (await axios.put(`${this.BASE_URL}/api/schedules/${id}`, data)).data;
  }

  static async deleteSchedule(id: number): Promise<any> {
    return (await axios.delete(`${this.BASE_URL}/api/schedules/${id}`)).data;
  }

  static async getScheduleByDoctorId(doctorId: number): Promise<any> {
    const res = await axios.get(`${this.BASE_URL}/api/schedules/doctor/${doctorId}`, {
      headers: this.getHeader(),
    });
    return res.data;
  }

  /** ---------------- REMINDER ---------------- */
  static async createReminder(data: any): Promise<any> {
    return (await axios.post(`${this.BASE_URL}/api/reminders`, data)).data;
  }

  static async updateReminderStatus(id: number, data: any): Promise<any> {
    return (await axios.put(`${this.BASE_URL}/api/reminders/${id}/status`, data)).data;
  }

  static async markReminderDone(id: number): Promise<any> {
    return (await axios.patch(`${this.BASE_URL}/api/reminders/${id}/done`)).data;
  }

  static async getTodayReminders(): Promise<any> {
    return (await axios.get(`${this.BASE_URL}/api/reminders/today/me`, {
      headers: this.getHeader(),
    })).data;
  }

  static async getRemindersByCustomer(customerId: number): Promise<any> {
    return (await axios.get(`${this.BASE_URL}/api/reminders/customer/${customerId}`)).data;
  }

  static async getAllMyReminders(): Promise<any> {
    return (await axios.get(`${this.BASE_URL}/api/reminders/all/me`, {
      headers: this.getHeader(),
    })).data;
  }

  /** ---------------- MEDICAL HISTORY ---------------- */
  static async getMedicalHistories(): Promise<any> {
    return (await axios.get(`${this.BASE_URL}/api/medical-histories`)).data;
  }

  static async getMedicalHistoryById(id: number): Promise<any> {
    return (await axios.get(`${this.BASE_URL}/api/medical-histories/${id}`)).data;
  }

  static async createMedicalHistory(data: any): Promise<any> {
    return (await axios.post(`${this.BASE_URL}/api/medical-histories`, data)).data;
  }

  static async updateMedicalHistory(id: number, data: any): Promise<any> {
    return (await axios.put(`${this.BASE_URL}/api/medical-histories/${id}`, data)).data;
  }

  static async deleteMedicalHistory(id: number): Promise<any> {
    return (await axios.delete(`${this.BASE_URL}/api/medical-histories/${id}`)).data;
  }

/** ---------------- DOCTOR ---------------- */
static async getAllDoctors(): Promise<any> {
  return (
    await axios.get(`${this.BASE_URL}/api/doctors`, {
      headers: this.getHeader(),
    })
  ).data;
}

static async getDoctorById(id: number): Promise<any> {
  return (
    await axios.get(`${this.BASE_URL}/api/doctors/${id}`, {
      headers: this.getHeader(),
    })
  ).data;
}

static async getMyDoctorProfile(): Promise<any> {
  return (
    await axios.get(`${this.BASE_URL}/api/doctors/me`, {
      headers: this.getHeader(),
    })
  ).data;
}

static async createDoctor(data: any): Promise<any> {
  return (
    await axios.post(`${this.BASE_URL}/api/doctors`, data, {
      headers: this.getHeader(),
    })
  ).data;
}

static async updateDoctor(id: number, data: any): Promise<any> {
  return (
    await axios.put(`${this.BASE_URL}/api/doctors/${id}`, data, {
      headers: this.getHeader(),
    })
  ).data;
}

static async deleteDoctor(id: number): Promise<any> {
  return (
    await axios.delete(`${this.BASE_URL}/api/doctors/${id}`, {
      headers: this.getHeader(),
    })
  ).data;
}

static async updateDoctorWithAvatar(id: number, formData: FormData): Promise<any> {
  const headers = this.getHeader();

  return (
    await axios.put(`${this.BASE_URL}/api/doctors/${id}`, formData, {
      headers: {
        Authorization: headers.Authorization,
        // ❗Không set Content-Type ở đây, axios sẽ tự thêm đúng boundary cho multipart
      },
    })
  ).data;
}
static async updateDoctorNoAvatar(id: number, data: any): Promise<any> {
  return (
    await axios.put(`${this.BASE_URL}/api/doctors/update-no-avatar/${id}`, data, {
      headers: this.getHeader(),
    })
  ).data;
}
static async getAllDoctorsWithAvatar(): Promise<Doctor[]> {
  const headers = this.getHeader(); // <== phải có Authorization
  
  return (
    await axios.get(`${this.BASE_URL}/api/doctors/with-avatar`, {
      headers: {
        Authorization: headers.Authorization, // Bearer token
      },
    })
  ).data;
}
static async getSlotsByDoctorAndDate(doctorId: number, date: string): Promise<any> {
  return (
    await axios.get(`${this.BASE_URL}/api/slots/available-slots`, {
      params: { doctorId, date },
    })
  ).data;
}

static async getAvailableDatesByDoctor(doctorId: number, date: string): Promise<any> {
  return (
    await axios.get(`${this.BASE_URL}/api/slots/available-dates`, {
      params: { doctorId, date },
    })
  ).data;
}



  /** ---------------- BLOG ---------------- */
static async getAllBlogs(): Promise<any> {
  return (await axios.get(`${this.BASE_URL}/api/blogposts`, {
    headers: this.getHeader(),
  })).data;
}

static async getBlogById(id: number): Promise<any> {
  return (await axios.get(`${this.BASE_URL}/api/blogposts/${id}`, {
    headers: this.getHeader(),
  })).data;
}

static async createBlog(data: any): Promise<any> {
  const headers = this.getHeader();
  console.log("➡️ Sending blog POST with headers:", headers); // <== DÒNG NÀY QUAN TRỌNG

  return (
    await axios.post(`${this.BASE_URL}/api/blogposts`, data, {
      headers,
    })
  ).data;
}


static async updateBlog(id: number, data: any): Promise<any> {
  return (await axios.put(`${this.BASE_URL}/api/blogposts/${id}`, data, {
    headers: this.getHeader(),
  })).data;
}

static async deleteBlog(id: number): Promise<any> {
  return (await axios.delete(`${this.BASE_URL}/api/blogposts/${id}`, {
    headers: this.getHeader(),
  })).data;
}


  /** ---------------- APPOINTMENT ---------------- */
  static async getAppointments(): Promise<any> {
    return (await axios.get(`${this.BASE_URL}/api/appointments`)).data;
  }

  static async getAppointmentById(id: number): Promise<any> {
    return (await axios.get(`${this.BASE_URL}/api/appointments/${id}`)).data;
  }

  static async createAppointment(data: any): Promise<any> {
    return (await axios.post(`${this.BASE_URL}/api/appointments`, data)).data;
  }

  static async updateAppointment(id: number, data: any): Promise<any> {
    return (await axios.put(`${this.BASE_URL}/api/appointments/${id}`, data)).data;
  }

  static async deleteAppointment(id: number): Promise<any> {
    return (await axios.delete(`${this.BASE_URL}/api/appointments/${id}`)).data;
  }

  /** ---------------- REGISTRATION ---------------- */
  static async registerAppointment(data: any): Promise<any> {
    return (await axios.post(`${this.BASE_URL}/api/registrations`, data)).data;
  }
    static async getAllRegistrations(): Promise<any> {
    return (await axios.get(`${this.BASE_URL}/api/registrations`)).data;
  }
  static async getRegistrationById(id: number): Promise<any> {
    return (await axios.get(`${this.BASE_URL}/api/registrations/${id}`)).data;
  }

  /** ---------------- ARV REGIMEN ---------------- */

static async getARVRegimens(): Promise<any> {
  const token = JSON.parse(localStorage.getItem("authData") || "{}")?.token;
  if (!token) throw new Error("Token not found");

  const response = await axios.get(`${this.BASE_URL}/api/arv-regimens`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
}



static async createARVRegimen(data: any): Promise<any> {
  const headers = this.getHeader();

  const response = await axios.post(`${this.BASE_URL}/api/arv-regimens`, data, {
    headers,
  });

  return response.data;
}

static async getARVRegimenById(id: number): Promise<any> {
  const headers = this.getHeader();

  return (
    await axios.get(`${this.BASE_URL}/api/arv-regimens/${id}`, {
      headers,
    })
  ).data;
}

static async updateARVRegimen(id: number, data: any): Promise<any> {
  const headers = this.getHeader();

  return (
    await axios.put(`${this.BASE_URL}/api/arv-regimens/${id}`, data, {
      headers,
    })
  ).data;
}

static async deleteARVRegimen(id: number): Promise<any> {
  const headers = this.getHeader();

  return (
    await axios.delete(`${this.BASE_URL}/api/arv-regimens/${id}`, {
      headers,
    })
  ).data;
}

static async getCustomerByEmail(email: string): Promise<any> {
  const headers = this.getHeader();
  const response = await axios.get(`${this.BASE_URL}/api/customers/by-email`, {
    headers,
    params: { email },
  });
  return response.data;
}

  /** ---------------- Customer---------------- */
static async getAllCustomers(): Promise<any[]> {
  const headers = this.getHeader();
  const response = await axios.get(`${this.BASE_URL}/api/customers`, { headers });
  return response.data;
}
static async getCustomerById(id: number): Promise<any> {
  const headers = this.getHeader();
  const response = await axios.get(`${this.BASE_URL}/api/customers/${id}`, { headers });
  return response.data;
}
static async getMyCustomerProfile(): Promise<any> {
  const headers = this.getHeader();
  const response = await axios.get(`${this.BASE_URL}/api/customers/me`, { headers });
  return response.data;
}
static async updateCustomerProfile(id: number, formData: FormData, token: string): Promise<any> {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return (
    await axios.put(`${this.BASE_URL}/api/customers/${id}`, formData, {
      headers,
    })
  ).data;
}





}
