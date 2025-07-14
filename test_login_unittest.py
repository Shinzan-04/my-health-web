import unittest, os, time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import HtmlTestRunner



# === CẤU HÌNH ===
LOGIN_URL = "http://localhost:3000/login"
CHROMEDRIVER = "chromedriver.exe"        # đổi path nếu cần
WAIT_TIME = 10                           # giây

class LoginTest(unittest.TestCase):
    # ---------- SETUP / TEARDOWN ----------
    def setUp(self):
        self.driver = webdriver.Chrome(service=Service(CHROMEDRIVER))
        self.driver.maximize_window()
        self.driver.get(LOGIN_URL)

        # Đợi ô email xuất hiện để chắc chắn trang đã load
        WebDriverWait(self.driver, WAIT_TIME).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'input[placeholder="Email"]'
))
        )

    def tearDown(self):
        self.driver.quit()

    # ---------- Helper ----------
    def _fill_email(self, email: str):
        el = self.driver.find_element(By.CSS_SELECTOR, 'input[placeholder="Email"]'
)
        el.clear(); el.send_keys(email)

    def _fill_pwd(self, pwd: str):
        el = self.driver.find_element(By.CSS_SELECTOR, 'input[placeholder="Mật khẩu"]'
)
        el.clear(); el.send_keys(pwd)

    def _submit(self):
        self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()

    def _expect_error(self, msg: str):
        err = WebDriverWait(self.driver, WAIT_TIME).until(
            EC.visibility_of_element_located(
                (By.XPATH, f"//div[contains(@class,'text-red-600') and contains(normalize-space(), '{msg.split()[0]}')]")
            )
        ).text.strip()
        print("Thông báo lỗi:", err)
        self.assertIn(msg, err)

    # ---------- Test cases ----------
    def test_login_success(self):
        self._fill_email("doc@gmail.com")
        self._fill_pwd("123123")
        self._submit()

        WebDriverWait(self.driver, WAIT_TIME).until(
            EC.url_contains("/doctorPanel")
        )
        self.assertIn("/doctorPanel", self.driver.current_url)

    def test_missing_email(self):
        self._fill_pwd("123123"); self._submit()
        self._expect_error("Vui lòng nhập email.")

    def test_missing_password(self):
        self._fill_email("doc@gmail.com"); self._submit()
        self._expect_error("Vui lòng nhập mật khẩu.")

    def test_missing_both_fields(self):
        self._submit()
        self._expect_error("Vui lòng nhập email.")

    def test_invalid_email_format(self):
        self._fill_email("abc"); self._fill_pwd("123123"); self._submit()
        self._expect_error("Định dạng email không hợp lệ.")

    def test_nonexistent_email(self):
        self._fill_email("noexist@gmail.com"); self._fill_pwd("123123"); self._submit()
        self._expect_error("Đăng nhập thất bại.")

    def test_wrong_password(self):
        self._fill_email("doc@gmail.com"); self._fill_pwd("sai_mat_khau"); self._submit()
        self._expect_error("Đăng nhập thất bại.")

# ---------- RUN ----------
if __name__ == "__main__":
    # Ép Python dùng UTF-8 để HtmlTestRunner không lỗi Unicode trên Windows
    os.environ["PYTHONIOENCODING"] = "utf-8"

    unittest.main(
        verbosity=2,
        testRunner=HtmlTestRunner.HTMLTestRunner(
            output="reports",
            report_name="LoginTest",
            combine_reports=True,
            add_timestamp=True
        )
    )
