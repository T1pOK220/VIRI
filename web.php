<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use App\Models\Admin;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Config;

$secretKey = Config::get('custom.secret_key');
$databaseUrl = Config::get('custom.database_url');
Route::get('/', function () {
    $projectImagesPath = public_path('static/imgs/project-images/');
    $projects = collect(scandir($projectImagesPath))->filter(function ($file) use ($projectImagesPath) {
        return is_file($projectImagesPath . $file);
    })->sortByDesc(fn ($file) => filemtime($projectImagesPath . $file));
    
    return view('index', ['projects' => $projects]);
});

Route::middleware(['auth'])->group(function () {
    Route::get('/admin', function () {
        $projectImagesPath = public_path('static/imgs/project-images/');
        $projects = collect(scandir($projectImagesPath))->filter(function ($file) use ($projectImagesPath) {
            return is_file($projectImagesPath . $file);
        })->sortByDesc(fn ($file) => filemtime($projectImagesPath . $file));
        
        return view('admin-panel', ['projects' => $projects, 'admin' => Session::get('admin')]);
    });

    Route::get('/admin/profile', function () {
        return view('admin-profile', ['adminLogin' => Session::get('admin')]);
    });

    Route::post('/admin/delete-photo', function (Request $request) {
        $photoName = $request->input('photo_name');
        $photoPath = public_path("static/imgs/project-images/" . $photoName);
        
        if ($photoName && file_exists($photoPath)) {
            unlink($photoPath);
            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false, 'message' => 'Фото не знайдено']);
    });

    Route::post('/admin/add-photo', function (Request $request) {
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $file->move(public_path('static/imgs/project-images/'), $file->getClientOriginalName());
            return response()->json(['message' => 'Файл успішно додано']);
        }
        return response()->json(['message' => 'Файл не знайдено'], 400);
    });

    Route::post('/change-login', function (Request $request) {
        $newLogin = $request->input('newLogin');
        $admin = Admin::where('login', Session::get('admin'))->first();
        
        if ($admin) {
            $admin->login = $newLogin;
            $admin->save();
            Session::put('admin', $newLogin);
            return redirect('/admin/profile')->with('message', 'Логін успішно змінено!');
        }

        return redirect('/login');
    });

    Route::post('/change-password', function (Request $request) {
        $oldPassword = $request->input('oldPassword');
        $newPassword = Hash::make($request->input('newPassword'));
        $admin = Admin::where('login', Session::get('admin'))->first();
        
        if ($admin && Hash::check($oldPassword, $admin->password)) {
            $admin->password = $newPassword;
            $admin->save();
            return redirect('/admin/profile')->with('message', 'Пароль успішно змінено!');
        }

        return redirect('/admin/profile')->with('error', 'Неправильний пароль!');
    });
});

Route::get('/login', function () {
    return view('login');
});

Route::post('/login', function (Request $request) {
    $adminUsername = $request->input('username');
    $adminPassword = $request->input('password');
    
    $admin = Admin::where('login', $adminUsername)->first();
    if ($admin && Hash::check($adminPassword, $admin->password)) {
        Session::put('admin', $adminUsername);
        return redirect('/admin');
    }

    return redirect('/login')->with('error', 'Неправильний логін або пароль!');
});
