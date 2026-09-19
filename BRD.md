# Business Requirements Document (BRD)
## LeaveFlow - Leave Management System

---

## 1. Document Overview
* **Project Name**: LeaveFlow Leave Management System
* **Document Version**: 1.0.0
* **Target Release Date**: 19th September, 2026
* **Prepared For**: Technical Assessment / Recruitment Team at Exelon Circuits
* **Author / Candidate**: Full-Stack MERN Developer Candidate

---

## 2. Business Objectives & Problem Statement
### 2.1 Problem Statement
In conventional organizational setups, tracking employee time-off, sick leaves, and vacation requests via emails or manual paperwork is error-prone, slow, and lacks transparency. Employees cannot readily see their remaining leave allowances, and administrators lack real-time visibility into workforce availability and pending approvals.

### 2.2 Business Objectives
* **Transparency**: Give employees instant visibility into their leave quotas, taken days, and real-time status of pending requests.
* **Operational Efficiency**: Empower managers and administrators to review, approve, or reject requests with one click, automatically updating corporate leave balances.
* **Accuracy & Compliance**: Prevent accidental over-utilization through automated date duration calculations and balance validations.
* **Simplicity & Maintainability**: Deliver a clean, responsive web application adhering to modern MERN stack practices without dependency on complex third-party UI frameworks.

---

## 3. User Personas & Roles

### 3.1 Employee
* **Needs**:
  * Log into the self-service portal securely.
  * Check current leave balance (e.g. Total 20, Used, Available).
  * Apply for Casual, Sick, or Earned leaves by specifying date ranges and reasons.
  * View pending, approved, and rejected leave requests.
  * View historical records and managerial remarks.

### 3.2 Administrator / HR Manager
* **Needs**:
  * High-level overview of company-wide employee counts and leave statistics.
  * Real-time list of all incoming leave applications.
  * Ability to Approve or Reject requests with feedback.
  * Comprehensive directory of all employees and their respective leave balances.

---

## 4. Functional Requirements

### 4.1 Authentication & Session Management
* **FR-1.1**: The system shall provide an authentication screen allowing users to input Email, Password, and select their Role (`Employee` or `Admin`).
* **FR-1.2**: User credentials shall be validated against stored hashed passwords using bcrypt.
* **FR-1.3**: Upon successful verification, the backend shall issue a cryptographically signed JSON Web Token (JWT) with standard expiration.
* **FR-1.4**: Client routes shall be protected by role-based guards; unauthorized or unauthenticated requests shall redirect to the login screen.

### 4.2 Employee Dashboard & Leave Application
* **FR-2.1**: The Employee Dashboard shall display four real-time metric cards: Total Leave, Available Leave, Used Leave, and Pending Requests.
* **FR-2.2**: The Dashboard shall display a graphical progress indicator showing percentage of leave utilized.
* **FR-2.3**: Employees can navigate to the "Apply for Leave" page to submit requests specifying Leave Type, Start Date, End Date, and Reason.
* **FR-2.4**: The system must automatically calculate the total calendar days between Start Date and End Date.
* **FR-2.5**: The system must reject submissions where requested days exceed the employee's available balance or where End Date precedes Start Date.

### 4.3 Review & Approval Workflow
* **FR-3.1**: The Admin Portal shall display a unified table of all employee leave applications.
* **FR-3.2**: For requests in `Pending` status, the Admin shall be presented with inline `Approve` and `Reject` action buttons.
* **FR-3.3**: Approving a leave shall automatically deduct the requested duration from the employee's available leave balance and increment used leave.
* **FR-3.4**: Rejecting a leave shall preserve the employee's available balance and mark the record as `Rejected`.

### 4.4 Employee Directory & Balance Tracking
* **FR-4.1**: The Admin shall have access to an Employee Directory displaying employee name, email, department, and current leave balance.
* **FR-4.2**: The Admin shall have access to a Leave Balance tracking view breaking down Total, Used, and Available days for each employee.

---

## 5. Non-Functional Requirements
* **Performance**: API response times under 200ms for standard queries.
* **Security**: Passwords hashed with bcrypt (salt rounds = 10), JWT tokens passed via Authorization Bearer headers, protected against SQL/NoSQL injection.
* **Usability & UI Fidelity**: Exact adherence to the provided design mockups; consistent typography, soft shadows, rounded corners, and clear status color coding.
* **Code Quality**: Modular architecture separating routes, controllers, middleware, and services. Zero unnecessary dependencies or complicated UI frameworks.

---

## 6. System Architecture & Tech Stack
* **Frontend**: React 18, React Router v6, Axios, Custom CSS3.
* **Backend**: Node.js v18+, Express.js 4.x.
* **Database**: MongoDB (Mongoose ODM) with dual-mode zero-config fallback.
* **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`.
* **Build System**: Vite 5.

---

## 7. Deployment Section

### 7.1 Hosting Platform Strategy
The application architecture supports both unified deployment (single full-stack service) and decoupled deployment (static frontend on CDN + containerized API service):

| Component | Target Platform | Tier | Alternative |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | [Vercel](https://vercel.com) | Free Hobby Tier | GitHub Pages / Netlify |
| **Backend API** | [Render](https://render.com) | Free Web Service Tier | Railway / Heroku |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | Free M0 Sandbox | Local MongoDB |

---

### 7.2 Required Cloud Services & Accounts
1. **GitHub Repository**: Houses the source code and enables automatic CI/CD triggers upon git push.
2. **MongoDB Atlas Account**: Managed MongoDB cloud cluster (M0 cluster provides 512MB free storage).
3. **Render Account**: Hosts the Node.js / Express web service.
4. **Vercel Account**: Hosts and delivers the Vite React frontend on global edge servers.

---

### 7.3 Step-by-Step Deployment Instructions

#### Phase 1: Database Setup (MongoDB Atlas)
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Sandbox Cluster**.
3. Under **Database Access**, create a database user (e.g., `leaveflow_admin`) with read/write privileges.
4. Under **Network Access**, add IP Address `0.0.0.0/0` (Allow Access from Anywhere) to permit cloud backend connections.
5. Click **Connect** -> **Connect your application** and copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/leaveflow?retryWrites=true&w=majority
   ```

#### Phase 2: Backend API Deployment (Render)
1. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Initial release of LeaveFlow MERN application"
   git push origin main
   ```
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the service settings:
   * **Name**: `leaveflow-api`
   * **Root Directory**: `server`
   * **Environment**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
5. Configure Environment Variables in the Render UI:
   * `PORT`: `5000`
   * `NODE_ENV`: `production`
   * `MONGO_URI`: `<Your MongoDB Atlas Connection String>`
   * `JWT_SECRET`: `prod_leaveflow_secret_key_998877`
   * `CLIENT_URL`: `https://leaveflow-app.vercel.app` (or `*`)
6. Click **Deploy Web Service**.
7. Once deployed, note your service URL: `https://leaveflow-api.onrender.com`. Test health at `https://leaveflow-api.onrender.com/api/health`.

#### Phase 3: Frontend Deployment (Vercel)
1. In the [Vercel Dashboard](https://vercel.com), click **Add New...** -> **Project**.
2. Select your imported GitHub repository.
3. Configure project settings:
   * **Framework Preset**: `Vite`
   * **Root Directory**: Click edit and select `client`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. In **Environment Variables**, add:
   * Key: `VITE_API_URL`
   * Value: `https://leaveflow-api.onrender.com/api`
5. Click **Deploy**.
6. Vercel will build and assign your production domain: `https://leaveflow-app.vercel.app`.

---

### 7.4 Steps to Update the Application (CI/CD Pipeline)
1. **Local Development & Testing**:
   * Make changes in local branches and test using `npm run build:client` and `npm run dev:server`.
2. **Push Updates**:
   * Commit and push changes to the `main` branch on GitHub:
     ```bash
     git add .
     git commit -m "feat: enhance leave approval notification"
     git push origin main
     ```
3. **Automatic Deployment**:
   * Both **Render** and **Vercel** listen to commits on the `main` branch via GitHub webhooks.
   * Render automatically pulls the latest `server/` files, runs `npm install`, and restarts the server with zero downtime.
   * Vercel builds the new static bundle from `client/` and switches traffic instantaneously to the new deployment.

---

## 8. Acceptance Criteria & Verification Summary
| ID | Requirement | Test Condition | Outcome |
| :--- | :--- | :--- | :--- |
| **AC-1** | Employee Login | Submit valid credentials for `ankitha@example.com` | Redirects to `/employee/dashboard` with valid JWT in storage |
| **AC-2** | Admin Login | Submit valid credentials for `admin@example.com` | Redirects to `/admin/dashboard` |
| **AC-3** | Leave Application | Select Casual Leave, choose 2 days, submit | Request created with `Pending` status; displays in table |
| **AC-4** | Balance Overrun Prevention | Request 30 days when available is 20 | Form displays clear validation error and blocks submission |
| **AC-5** | Admin Approval | Admin clicks `Approve` on pending request | Status updates to `Approved`, employee available balance decreases |
| **AC-6** | Admin Rejection | Admin clicks `Reject` on pending request | Status updates to `Rejected`, no balance deduction |
| **AC-7** | Responsive UI | Access portal on mobile/desktop screen widths | Sidebar collapses smoothly, cards and tables reflow cleanly |
