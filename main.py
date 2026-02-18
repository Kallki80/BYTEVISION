from flask import Flask, render_template, request, redirect, send_from_directory
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

load_dotenv()  # load .env file

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")
print("SECRET_KEY =", os.getenv("SECRET_KEY"))


@app.route('/')
def home():
    return render_template('index.html', active_page='home')

@app.route('/about')
def about():
    return render_template('about.html', active_page='about')

@app.route('/services')
def services():
    return render_template('services.html', active_page='services')

@app.route('/projects')
def projects():
    return render_template('projects.html', active_page='projects')

@app.route('/model')
def model():
    return render_template('model.html', active_page='model')

@app.route('/contact')
def contact():
    return render_template('contact.html', active_page='contact')

@app.route('/google8f30c4a7864fe662.html')
def google_verify():
    return send_from_directory('static', 'google8f30c4a7864fe662.html')


@app.route('/send_message', methods=['POST'])
def send_message():
    name = request.form['name']
    email = request.form['email']
    phone = request.form['phone']
    subject = request.form['subject']
    message = request.form['message']

    send_email(name, email, phone, subject, message)

    # flash("Message sent successfully!")
    return redirect('/contact')


def send_email(name, email, phone, subject, message):
    sender_email = os.getenv("EMAIL")
    sender_password = os.getenv("EMAIL_PASSWORD")
    receiver_email = os.getenv("EMAIL")  # same mail receive karega

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = f"New Contact Message - {subject}"

    body = f"""
    Name: {name}
    Email: {email}
    Phone: {phone}
    Subject: {subject}
    Message: {message}
    """

    msg.attach(MIMEText(body, 'plain'))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(sender_email, sender_password)
    server.send_message(msg)
    server.quit()

if __name__ == '__main__':
    app.run(debug=True)
