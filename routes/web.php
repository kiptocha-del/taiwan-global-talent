<?php

// Auth
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Auth\GoogleAuthController;
// Company
use App\Http\Controllers\Company\CompanyApplicantController;
use App\Http\Controllers\Company\CompanyApplyController;
use App\Http\Controllers\Company\CompanyCommunityController;
use App\Http\Controllers\Company\CompanyJobController;
use App\Http\Controllers\Company\DashboardController as CompanyDashboardController;
// Landing & Partners
use App\Http\Controllers\LandingController;
use App\Http\Controllers\Partner\PartnerInquiryController;
// Profile
use App\Http\Controllers\Profile\ProfilePageController;
// Student
use App\Http\Controllers\Student\CommunityPostController;
use App\Http\Controllers\Student\CourseController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Student\DownloadCertificateController;
use App\Http\Controllers\Student\EnrollmentController;
use App\Http\Controllers\Student\LessonProgressController;
use App\Http\Controllers\Student\StudentJobController;
// Teacher
use App\Http\Controllers\Teacher\DashboardController as TeacherDashboardController;
use App\Http\Controllers\Teacher\TeacherApplyController;
use App\Http\Controllers\Teacher\TeacherCommunityController;
use App\Http\Controllers\Teacher\TeacherCourseController;
use App\Http\Controllers\Teacher\TeacherLessonController;
use App\Http\Controllers\Teacher\TeacherModuleController;
use Illuminate\Support\Facades\Route;

Route::get('/', LandingController::class)->name('home');
Route::inertia('/courses', 'Courses')->name('courses');
Route::inertia('/about', 'About')->name('about');

Route::get('/get-involved', [PartnerInquiryController::class, 'index'])->name('get-involved');
Route::post('/get-involved', [PartnerInquiryController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('get-involved.store');

Route::get('/login', [GoogleAuthController::class, 'index'])->name('login');

Route::get('/auth/google', [GoogleAuthController::class, 'redirect'])->name('auth.google');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->name('auth.google.callback');

Route::post('/login-admin', [AdminAuthController::class, 'login'])
    ->middleware('throttle:5,1')
    ->name('admin.login');

Route::middleware(['auth', 'verified'])->group(function () {

    // Company Apply & Waiting
    Route::prefix('company/apply')->name('company.')->group(function () {
        Route::get('/', [CompanyApplyController::class, 'create'])
            ->name('register');
        Route::post('/store', [CompanyApplyController::class, 'store'])
            ->name('store');
        Route::get('/waiting', [CompanyApplyController::class, 'waiting'])
            ->name('waiting');
    });

    // Teacher Apply & Waiting
    Route::prefix('teacher/apply')->name('teacher.')->group(function () {
        Route::get('/', [TeacherApplyController::class, 'create'])
            ->name('apply');
        Route::post('/store', [TeacherApplyController::class, 'store'])
            ->name('store');
        Route::get('/waiting-approval', [TeacherApplyController::class, 'waiting'])
            ->name('waiting');
    });

    // COMPANY ROLE
    Route::middleware(['role:company', 'check.company.status'])->group(function () {

        Route::patch('/profile/update', [ProfilePageController::class, 'update'])
            ->name('profile.update');

        Route::prefix('company')->name('company.')->group(function () {
            Route::get('/dashboard', [CompanyDashboardController::class, 'index'])
                ->name('dashboard');

            Route::get('/profile', [ProfilePageController::class, 'show'])
                ->name('profile.show');

            // Job Postings Routes
            Route::resource('jobs', CompanyJobController::class);

            // Applicants Routes
            Route::get('/applicants', [CompanyApplicantController::class, 'index'])
                ->name('applicants.index');

            // Community Routes
            Route::prefix('community')->name('community.')->group(function () {
                Route::get('/', [CompanyCommunityController::class, 'index'])
                    ->name('index');

                Route::post('/', [CompanyCommunityController::class, 'store'])
                    ->name('store');

                Route::post('/{id}/like', [CompanyCommunityController::class, 'toggleLike'])
                    ->name('like');

                Route::post('/{id}/comment', [CompanyCommunityController::class, 'storeComment'])
                    ->name('comment');

                Route::post('/posts/{id}/report', [CompanyCommunityController::class, 'report'])
                    ->name('posts.report');

                Route::delete('/posts/{id}', [CompanyCommunityController::class, 'destroy'])
                    ->name('posts.destroy');
            });
        });
    });

    // STUDENT ROLE
    Route::middleware('role:student')->group(function () {

        Route::prefix('student')->name('student.')->group(function () {
            Route::get('/dashboard', [StudentDashboardController::class, 'index'])
                ->name('dashboard');

            Route::prefix('courses')->name('courses.')->group(function () {

                // 1. Index & Enroll (Paling atas)
                Route::get('/', [CourseController::class, 'index'])
                    ->name('index');

                Route::post('/{module}/enroll', [EnrollmentController::class, 'enroll'])
                    ->name('enroll');

                Route::post('/{module}/lessons/{lesson}/complete', [LessonProgressController::class, 'completeLesson'])
                    ->name('lessons.complete');

                // 2. Sertifikat (Dipindah ke atas wildcard agar tidak tertangkap oleh {categorySlug})
                Route::get('/certificate', [DownloadCertificateController::class, 'index'])
                    ->name('certificate.index');

                Route::get('/{module}/certificate', [DownloadCertificateController::class, 'downloadCertificate'])
                    ->middleware('throttle:certificate-download')
                    ->name('certificate.download');

                // 3. Detail Kategori & Detail Kursus (Paling bawah)
                Route::get('/{categorySlug}', [CourseController::class, 'showByCategory'])
                    ->name('showCategory');

                Route::get('/{categorySlug}/{module}', [CourseController::class, 'show'])
                    ->name('show');
            });

            Route::get('/profile', [ProfilePageController::class, 'show'])
                ->name('profile.show');

            Route::prefix('community')->name('community.')->group(function () {

                Route::get('/', [CommunityPostController::class, 'index'])
                    ->name('index');

                Route::post('/posts', [CommunityPostController::class, 'store'])
                    ->name('posts.store');

                Route::post('/posts/{id}/like', [CommunityPostController::class, 'toggleLike'])
                    ->name('posts.like');

                Route::post('/posts/{postId}/comments', [CommunityPostController::class, 'storeComment'])
                    ->name('comments.store');

                Route::post('/posts/{id}/report', [CommunityPostController::class, 'report'])
                    ->name('posts.report');

                Route::delete('/posts/{id}', [CommunityPostController::class, 'destroy'])
                    ->name('posts.destroy');
            });

            // Student Jobs Routes
            Route::prefix('jobs')->name('jobs.')->group(function () {

                Route::get('/', [StudentJobController::class, 'index'])
                    ->name('index');

                Route::get('/{job:slug}', [StudentJobController::class, 'show'])
                    ->name('show');

                Route::post('/{job}/apply', [StudentJobController::class, 'apply'])
                    ->name('apply');
            });
        });

        Route::patch('/profile/update', [ProfilePageController::class, 'update'])
            ->name('profile.update');
    });

    // TEACHER ROLE
    Route::middleware('role:teacher')->prefix('teacher')->name('teacher.')->group(function () {
        // 1. Dashboard Overview
        Route::get('/dashboard', [TeacherDashboardController::class, 'index'])
            ->name('dashboard');

        // 2. Courses Page (CourseCategory)
        Route::get('/courses', [TeacherCourseController::class, 'index'])
            ->name('courses.index');

        Route::get('/courses/create', [TeacherCourseController::class, 'create'])
            ->name('courses.create');

        Route::post('/courses', [TeacherCourseController::class, 'store'])
            ->name('courses.store');

        Route::get('/courses/{category:slug}', [TeacherCourseController::class, 'show'])
            ->name('courses.show');

        // 3. Modules Page (Module)
        Route::get('/modules', [TeacherModuleController::class, 'index'])
            ->name('modules.index');

        Route::get('/modules/create', [TeacherModuleController::class, 'create'])
            ->name('modules.create');

        Route::post('/modules', [TeacherModuleController::class, 'store'])
            ->name('modules.store');

        Route::get('/modules/{module}', [TeacherModuleController::class, 'show'])
            ->name('modules.show');

        Route::get('/modules/{module}/edit', [TeacherModuleController::class, 'edit'])
            ->name('modules.edit');

        Route::put('/modules/{module}', [TeacherModuleController::class, 'update'])
            ->name('modules.update');

        Route::delete('/modules/{module}', [TeacherModuleController::class, 'destroy'])
            ->name('modules.destroy');

        // 4. Lessons CRUD (Lesson)
        Route::get('/modules/{module}/lessons/create', [TeacherLessonController::class, 'create'])
            ->name('lessons.create');

        Route::post('/modules/{module}/lessons', [TeacherLessonController::class, 'store'])
            ->name('lessons.store');

        Route::get('/lessons/{lesson}/edit', [TeacherLessonController::class, 'edit'])
            ->name('lessons.edit');

        Route::put('/lessons/{lesson}', [TeacherLessonController::class, 'update'])
            ->name('lessons.update');

        Route::delete('/lessons/{lesson}', [TeacherLessonController::class, 'destroy'])
            ->name('lessons.destroy');

        // 5. Community CRUD (CommunityPost & Comment)
        Route::prefix('community')->name('community.')->group(function () {
            Route::get('/', [TeacherCommunityController::class, 'index'])
                ->name('index');

            Route::post('/', [TeacherCommunityController::class, 'store'])
                ->name('store');

            Route::post('/{id}/like', [TeacherCommunityController::class, 'toggleLike'])
                ->name('like');

            Route::post('/{id}/comment', [TeacherCommunityController::class, 'storeComment'])
                ->name('comment');

            Route::post('/posts/{id}/report', [TeacherCommunityController::class, 'report'])
                ->name('posts.report');

            Route::delete('/posts/{id}', [TeacherCommunityController::class, 'destroy'])
                ->name('posts.destroy');
        });
    });

    Route::post('/logout', function () {
        auth()->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirect('/');
    })->name('logout');
});
