const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({
 testDir:'./tests',
 testMatch:'*.spec.cjs',
 timeout:30000,
 retries:process.env.CI?1:0,
 use:{baseURL:'http://127.0.0.1:8765',browserName:'chromium',trace:'retain-on-failure'},
 webServer:{command:'python3 -m http.server 8765 --bind 127.0.0.1',url:'http://127.0.0.1:8765',reuseExistingServer:!process.env.CI,timeout:15000}
});
