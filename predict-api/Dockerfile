# use the official python image
FROM python:3.10-slim

# set working directory
WORKDIR /app

# copy the contents into the working directory
COPY . .

# install the necessary python packages
RUN pip install --no-cache-dir -r requirements.txt

# expose the port
EXPOSE 5000

# run the application
CMD ["python", "app.py"]