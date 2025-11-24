# Šrumec – School Project for MOIS (UHK)

Šrumec is a school project created for the **MOIS (Modern Information Systems)** course at **UHK**.  
The goal of the application is to enable **sharing of local events** using a modern service architecture.

The backend of the project is built on a **microservice architecture**, which is a key requirement of the MOIS course.

---

## 👥 Authors

- **Jiří Žák**
- **Jiří Dostál**
- **Martin Portych**
- **Michal Novák**

---

## 📥 How to Download the Project

```sh
git clone https://github.com/jirka124/srumec
cd srumec
```

This project works as a **monorepo** that contains other services using **git subtree**:

- `./srumec-orchestration`
- `./srumec-events-service`
- `./srumec-rabbitmq-client`
- `./srumec-rabbitmq-service`

---

## 🔄 How to Update the Project

Regular project update:

```sh
git pull
```

---

## 🔄 How to Add a Remote for a Subtree

Adding a remote (e.g., `orchestration`):

```sh
git remote add <remote_name> <remote_url>
# Example:
git remote add orchestration https://github.com/jirka124/srumec-orchestration.git
```

---

## 🔁 How to Update a Subtree Service

To pull updates from a specific subtree (e.g., `orchestration`):

```sh
git fetch <remote_name>
git subtree pull --prefix=<subfolder_name> <remote_name> main --squash
git push origin main

# Example:
git fetch orchestration
git subtree pull --prefix=srumec-orchestration orchestration main --squash
git push origin main
```

---

## ▶ How to Run the Project

The application is started using the orchestration inside the directory:

```
./srumec-orchestration
```
