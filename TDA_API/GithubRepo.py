from github import Github, InputGitAuthor
import os
from dotenv import load_dotenv, find_dotenv
import json


class GithubRepo:
    def __init__(self, repo):
        load_dotenv(find_dotenv())
        self.g = Github(os.getenv('GITHUB_TOKEN'))
        self.repo = repo
        self.author = InputGitAuthor(
            "Cheok Capital Bot",
            "cheokcapital@gmail.com"
        )

    def create_branch(self, on, name):
        repo = self.g.get_repo(self.repo)
        source = repo.get_branch(on)
        repo.create_git_ref(ref=f"refs/heads/{name}", sha=source.commit.sha)

    def create_file(self, file_path, file_content, commit_message, branch):
        repo = self.g.get_repo(self.repo)
        repo.create_file(
            path=file_path,
            message=commit_message,
            content=file_content,
            branch=branch,
            author=self.author)

    def update_file(self, file_path, commit_message, updater, branch):
        repo = self.g.get_repo(self.repo)

        # Get file from branch
        file = repo.get_contents(file_path, ref=branch)
        raw_data = file.decoded_content.decode("utf-8")

        updated_data = updater(raw_data)

        repo.update_file(
            path=file_path,
            message=commit_message,
            content=updated_data,
            sha=file.sha,
            branch=branch,
            author=self.author
        )

    def create_pull(self, base, head, title, body=""):
        repo = self.g.get_repo(self.repo)
        repo.create_pull(title, body, base, head)

    def get_pulls(self, *args, **kwargs):
        repo = self.g.get_repo(self.repo)
        return repo.get_pulls(*args, **kwargs)