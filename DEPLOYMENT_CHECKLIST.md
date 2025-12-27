# ✅ Deployment Checklist

Use this checklist to ensure your app is ready for deployment.

## Pre-Deployment

### Backend
- [ ] All environment variables are set in `.env`
- [ ] Database connection tested and working
- [ ] All API endpoints tested (use Postman or curl)
- [ ] CORS configured for production frontend URL
- [ ] Error handling in place
- [ ] Security checks implemented (user verification)

### Frontend
- [ ] API URL configured for production
- [ ] All features tested locally
- [ ] Mobile responsive design verified
- [ ] Browser compatibility tested

### Database
- [ ] Database accessible from deployment platform
- [ ] Tables created successfully
- [ ] Foreign key constraints working
- [ ] Indexes created (if needed)

## Deployment Steps

### 1. Backend Deployment
- [ ] Create account on deployment platform
- [ ] Connect GitHub repository
- [ ] Set environment variables
- [ ] Configure database connection
- [ ] Deploy and verify health endpoint
- [ ] Test API endpoints

### 2. Frontend Deployment
- [ ] Update API URL in `config.js` or `index.html`
- [ ] Deploy to hosting platform
- [ ] Test all features
- [ ] Verify CORS works

### 3. Post-Deployment
- [ ] Test user registration
- [ ] Test PIN login
- [ ] Test task creation
- [ ] Test task editing
- [ ] Test task deletion
- [ ] Test multi-user isolation
- [ ] Verify tasks persist across sessions

## Security Checklist

- [ ] CORS restricted to frontend domain (not `*`)
- [ ] Database credentials secure
- [ ] Environment variables not committed to Git
- [ ] HTTPS enabled (for production)
- [ ] User data isolation verified
- [ ] Input validation working

## Performance Checklist

- [ ] Database queries optimized
- [ ] API response times acceptable
- [ ] Frontend loads quickly
- [ ] Images/assets optimized

## Testing Checklist

- [ ] Create user with PIN
- [ ] Create user without PIN
- [ ] Login with PIN
- [ ] Add task with all fields
- [ ] Edit task
- [ ] Delete task
- [ ] Mark task complete
- [ ] Test on mobile device
- [ ] Test on different browsers
- [ ] Test with multiple users (multi-tenant)

## Documentation

- [ ] README.md updated
- [ ] DEPLOYMENT.md complete
- [ ] API endpoints documented
- [ ] Environment variables documented

---

**Ready to deploy?** Follow the steps in [DEPLOYMENT.md](./DEPLOYMENT.md)

