<?php
if (!defined('ABSPATH')) { exit; }

function kosala_portfolio_setup() {
    add_theme_support('title-tag');
    add_theme_support('custom-logo');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array('search-form', 'gallery', 'caption', 'style', 'script'));
}
add_action('after_setup_theme', 'kosala_portfolio_setup');

function kosala_portfolio_document() {
    $file = get_theme_file_path('/portfolio-template.html');
    if (!is_readable($file)) {
        return '<main><h1>Portfolio template file is missing.</h1></main>';
    }
    $html = file_get_contents($file);
    $name = get_theme_mod('kosala_name', 'Kosala Daneshwara');
    $role = get_theme_mod('kosala_role', 'Software Engineer');
    $email = get_theme_mod('kosala_email', 'kosalaathapaththu1234@gmail.com');
    $phone = preg_replace('/[^0-9+]/', '', get_theme_mod('kosala_phone', '+94719148762'));
    $replacements = array(
        '{{theme_uri}}' => esc_url(get_template_directory_uri()),
        'Kosala Daneshwara' => esc_html($name),
        'Software Engineer' => esc_html($role),
        'kosalaathapaththu1234@gmail.com' => sanitize_email($email),
        '+94719148762' => esc_attr($phone),
        'https://www.linkedin.com/in/kosala-d-athapaththu-a453b9248/' => esc_url(get_theme_mod('kosala_linkedin', 'https://www.linkedin.com/in/kosala-d-athapaththu-a453b9248/')),
        'https://github.com/kosaladathapththu' => esc_url(get_theme_mod('kosala_github', 'https://github.com/kosaladathapththu')),
        '/api/views' => esc_url_raw(rest_url('kosala-portfolio/v1/views')),
        '/api/chat' => esc_url_raw(rest_url('kosala-portfolio/v1/chat')),
        '/api/generate-image' => esc_url_raw(rest_url('kosala-portfolio/v1/generate-image')),
    );
    $html = strtr($html, $replacements);
    ob_start(); wp_head(); $head = ob_get_clean();
    ob_start(); wp_footer(); $footer = ob_get_clean();
    $html = str_replace('</head>', $head . '</head>', $html);
    $html = str_replace('</body>', $footer . '</body>', $html);
    return $html;
}

function kosala_portfolio_customize($customizer) {
    $customizer->add_section('kosala_identity', array(
        'title' => __('Portfolio Identity', 'kosala-portfolio'),
        'priority' => 30,
        'description' => __('Update the main identity and contact details.', 'kosala-portfolio'),
    ));
    $fields = array(
        'kosala_name' => array('Name', 'Kosala Daneshwara'),
        'kosala_role' => array('Professional role', 'Software Engineer'),
        'kosala_email' => array('Email address', 'kosalaathapaththu1234@gmail.com'),
        'kosala_phone' => array('Phone number', '+94719148762'),
        'kosala_linkedin' => array('LinkedIn URL', 'https://www.linkedin.com/in/kosala-d-athapaththu-a453b9248/'),
        'kosala_github' => array('GitHub URL', 'https://github.com/kosaladathapththu'),
    );
    foreach ($fields as $id => $field) {
        $is_url = in_array($id, array('kosala_linkedin', 'kosala_github'), true);
        $customizer->add_setting($id, array(
            'default' => $field[1],
            'sanitize_callback' => $is_url ? 'esc_url_raw' : 'sanitize_text_field',
        ));
        $customizer->add_control($id, array(
            'label' => __($field[0], 'kosala-portfolio'),
            'section' => 'kosala_identity',
            'type' => 'text',
        ));
    }
}
add_action('customize_register', 'kosala_portfolio_customize');

function kosala_portfolio_views(WP_REST_Request $request) {
    $visitor = sanitize_text_field((string) $request->get_param('visitorId'));
    if ($visitor === '') {
        return new WP_Error('missing_visitor', 'Visitor identifier required.', array('status' => 400));
    }
    $key = 'kosala_seen_' . md5($visitor);
    $views = (int) get_option('kosala_portfolio_views', 0);
    if (get_transient($key) === false) {
        $views++;
        update_option('kosala_portfolio_views', $views, false);
        set_transient($key, 1, DAY_IN_SECONDS);
    }
    return rest_ensure_response(array('views' => $views));
}

add_action('rest_api_init', function () {
    register_rest_route('kosala-portfolio/v1', '/views', array(
        'methods' => 'POST',
        'callback' => 'kosala_portfolio_views',
        'permission_callback' => '__return_true',
    ));
    register_rest_route('kosala-portfolio/v1', '/chat', array(
        'methods' => 'POST',
        'callback' => 'kosala_portfolio_chat',
        'permission_callback' => '__return_true',
    ));
    register_rest_route('kosala-portfolio/v1', '/generate-image', array(
        'methods' => 'POST',
        'callback' => function () {
            return new WP_Error('not_configured', 'Image generation requires a Replicate integration.', array('status' => 501));
        },
        'permission_callback' => '__return_true',
    ));
});

function kosala_portfolio_chat(WP_REST_Request $request) {
    $message = strtolower(sanitize_text_field((string) $request->get_param('message')));
    if (str_contains($message, 'contact') || str_contains($message, 'hire') || str_contains($message, 'email')) {
        $answer = 'You can contact ' . get_theme_mod('kosala_name', 'Kosala') . ' through the contact form, email, WhatsApp, or LinkedIn links on this page.';
    } elseif (str_contains($message, 'project') || str_contains($message, 'portfolio')) {
        $answer = 'The portfolio includes full-stack platforms, renewable-energy dashboards, mobile applications, machine-learning work, database systems, and IoT projects. Open any project card for more details.';
    } elseif (str_contains($message, 'skill') || str_contains($message, 'technology') || str_contains($message, 'stack')) {
        $answer = 'Core skills include Java, PHP, C#, JavaScript, Python, React, Spring Boot, Node.js, SQL databases, Firebase, Android, cloud tools, and Arduino-based IoT development.';
    } elseif (str_contains($message, 'service') || str_contains($message, 'build')) {
        $answer = 'Available services include web applications, mobile apps, APIs and backend systems, business dashboards, database solutions, and IoT prototypes.';
    } else {
        $answer = 'I can help you explore the portfolio, technical skills, software services, projects, or ways to get in touch.';
    }
    return rest_ensure_response(array('answer' => $answer));
}
