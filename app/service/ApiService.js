import axios from "axios";

export default class ApiService {
  static BASE_URL = "http://localhost:8080";

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
  static async registerUser(data) {
    return (await axios.post(`${this.BASE_URL}/api/register`, data)).data;
  }

  static async loginUser(data) {
    return (await axios.post(`${this.BASE_URL}/api/login`, data)).data;
  }

  /** ---------------- TEST RESULT ---------------- */
  static async getTestResults() {
    return (await axios.get(`${this.BASE_URL}/api/test-results`)).data;
  }

  static async getTestResultById(id) {
    return (await axios.get(`${this.BASE_URL}/api/test-results/${id}`)).data;
  }

  static async createTestResult(data) {
    return (await axios.post(`${this.BASE_URL}/api/test-results`, data)).data;
  }

  static async updateTestResult(id, data) {
    return (await axios.put(`${this.BASE_URL}/api/test-results/${id}`, data))
      .data;
  }

  static async deleteTestResult(id) {
    return (await axios.delete(`${this.BASE_URL}/api/test-results/${id}`)).data;
  }

  /** ---------------- SCHEDULE ---------------- */
  static async getSchedules() {
    return (await axios.get(`${this.BASE_URL}/api/schedules`)).data;
  }

  static async getScheduleById(id) {
    return (await axios.get(`${this.BASE_URL}/api/schedules/${id}`)).data;
  }

  static async getSchedulesByDoctor(doctorId) {
    return (
      await axios.get(`${this.BASE_URL}/api/schedules/doctor/${doctorId}`)
    ).data;
  }

  static async createSchedule(data) {
    return (await axios.post(`${this.BASE_URL}/api/schedules`, data)).data;
  }

  static async updateSchedule(id, data) {
    return (await axios.put(`${this.BASE_URL}/api/schedules/${id}`, data)).data;
  }

  static async deleteSchedule(id) {
    return (await axios.delete(`${this.BASE_URL}/api/schedules/${id}`)).data;
  }
  static async getScheduleByDoctorId(doctorId) {
    const res = await axios.get(
      `${this.BASE_URL}/api/schedules/doctor/${doctorId}`,
      {
        headers: this.getHeader(),
      }
    );
    console.log("API res:", res.data); // Ghi log để kiểm tra
    return res.data; // Bạn cần đảm bảo đây là một array
  }

  /** ---------------- REMINDER ---------------- */
  static async createReminder(data) {
    return (await axios.post(`${this.BASE_URL}/api/reminders`, data)).data;
  }

  static async updateReminderStatus(id, data) {
    return (
      await axios.put(`${this.BASE_URL}/api/reminders/${id}/status`, data)
    ).data;
  }

  static async markReminderDone(id) {
    return (await axios.patch(`${this.BASE_URL}/api/reminders/${id}/done`))
      .data;
  }

  static async getTodayReminders() {
    return (
      await axios.get(`${this.BASE_URL}/api/reminders/today/me`, {
        headers: this.getHeader(),
      })
    ).data;
  }

  static async getRemindersByCustomer(customerId) {
    return (
      await axios.get(`${this.BASE_URL}/api/reminders/customer/${customerId}`)
    ).data;
  }

  static async getAllMyReminders() {
    return (
      await axios.get(`${this.BASE_URL}/api/reminders/all/me`, {
        headers: this.getHeader(),
      })
    ).data;
  }

  /** ---------------- MEDICAL HISTORY ---------------- */
  static async getMedicalHistories() {
    return (await axios.get(`${this.BASE_URL}/api/medical-histories`)).data;
  }

  static async getMedicalHistoryById(id) {
    return (await axios.get(`${this.BASE_URL}/api/medical-histories/${id}`))
      .data;
  }

  static async createMedicalHistory(data) {
    return (await axios.post(`${this.BASE_URL}/api/medical-histories`, data))
      .data;
  }

  static async updateMedicalHistory(id, data) {
    return (
      await axios.put(`${this.BASE_URL}/api/medical-histories/${id}`, data)
    ).data;
  }

  static async deleteMedicalHistory(id) {
    return (await axios.delete(`${this.BASE_URL}/api/medical-histories/${id}`))
      .data;
  }

  /** ---------------- DOCTOR ---------------- */
  static async getAllDoctors() {
    return (await axios.get(`${this.BASE_URL}/api/doctors`)).data;
  }

  static async getDoctorById(id) {
    return (await axios.get(`${this.BASE_URL}/api/doctors/${id}`)).data;
  }

  static async getMyDoctorProfile() {
    return (
      await axios.get(`${this.BASE_URL}/api/doctors/me`, {
        headers: this.getHeader(),
      })
    ).data;
  }

  static async createDoctor(data) {
    return (await axios.post(`${this.BASE_URL}/api/doctors`, data)).data;
  }

  static async updateDoctor(id, data) {
    return (await axios.put(`${this.BASE_URL}/api/doctors/${id}`, data)).data;
  }

  static async deleteDoctor(id) {
    return (await axios.delete(`${this.BASE_URL}/api/doctors/${id}`)).data;
  }
  static async updateDoctorWithAvatar(id, formData, token) {
    const res = await fetch(`${this.BASE_URL}/api/doctors/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // KHÔNG thêm Content-Type, trình duyệt sẽ tự động thêm multipart/form-data + boundary
      },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || "Cập nhật thất bại");
    }

    return res.json();
  }

  /** ---------------- BLOG ---------------- */
  static async getAllBlogs() {
    return (await axios.get(`${this.BASE_URL}/api/blog`)).data;
  }

  static async getBlogById(id) {
    return (await axios.get(`${this.BASE_URL}/api/blog/${id}`)).data;
  }

  static async createBlog(data) {
    return (await axios.post(`${this.BASE_URL}/api/blog`, data)).data;
  }

  static async updateBlog(id, data) {
    return (await axios.put(`${this.BASE_URL}/api/blog/${id}`, data)).data;
  }

  static async deleteBlog(id) {
    return (await axios.delete(`${this.BASE_URL}/api/blog/${id}`)).data;
  }

  /** ---------------- APPOINTMENT ---------------- */
  static async getAppointments() {
    return (await axios.get(`${this.BASE_URL}/api/appointments`)).data;
  }

  static async getAppointmentById(id) {
    return (await axios.get(`${this.BASE_URL}/api/appointments/${id}`)).data;
  }

  static async createAppointment(data) {
    return (await axios.post(`${this.BASE_URL}/api/appointments`, data)).data;
  }

  static async updateAppointment(id, data) {
    return (await axios.put(`${this.BASE_URL}/api/appointments/${id}`, data))
      .data;
  }

  static async deleteAppointment(id) {
    return (await axios.delete(`${this.BASE_URL}/api/appointments/${id}`)).data;
  }

  /** ---------------- REGISTRATION ---------------- */
  static async registerAppointment(data) {
    return (await axios.post(`${this.BASE_URL}/api/registrations`, data)).data;
  }
}
