import bcrypt

password = "admin"

hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

print(hashed_password)

# $2b$12$n78f8sayXb8WleT8JgY.WeEHosc57HBHxz1gOgyX4ZD.7X5dTbo3a