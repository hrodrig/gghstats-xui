# gghstats-xui — same gitflow as gghstats (PR-only; no direct push to develop/main).
#
#   topic (feature|fix|chore|docs|security/<name>)
#     → PR → develop
#     → (ship) PR develop → main
#     → annotated tag vX.Y.Z on main → GHCR release.yml
#
# Never: git push origin develop | git push origin main
# Never: local merge onto main — use gh pr

.DEFAULT_GOAL := help

GREEN  := \033[0;32m
YELLOW := \033[0;33m
RESET  := \033[0m

VERSION_RAW ?= $(shell cat VERSION 2>/dev/null | tr -d '\n\r')
VERSION     := $(patsubst v%,%,$(VERSION_RAW))
TAG         := v$(VERSION)

.PHONY: help check build gitflow

help:
	@echo "$(GREEN)gghstats-xui$(RESET) — Atlas Day UI (SvelteKit BFF)"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "$(YELLOW)Quality:$(RESET)"
	@echo "  $(GREEN)check$(RESET)    npm run check"
	@echo "  $(GREEN)build$(RESET)    npm run build"
	@echo ""
	@echo "$(YELLOW)Gitflow (gghstats mold):$(RESET)"
	@echo "  $(GREEN)gitflow$(RESET)  Print canonical branch/PR/tag sequence"
	@echo ""
	@echo "VERSION: $(VERSION) (tag: $(TAG))"
	@echo ""
	@echo "Hard rules:"
	@echo "  - Work on topic branches from develop; PR into develop"
	@echo "  - Never push/commit directly to develop or main"
	@echo "  - Ship: PR develop → main, then tag v* on main (user OK)"
	@echo "  - No uat (that is gghstats-com / marketing webs)"

check:
	npm run check

build:
	npm run build

gitflow:
	@echo "$(GREEN)gghstats-xui gitflow$(RESET) (same as gghstats)"
	@echo ""
	@echo "1.  git fetch && git checkout develop && git pull --ff-only"
	@echo "2.  git checkout -b feature|fix|chore|docs|security/<short-name>"
	@echo "3.  edits + approved commit(s)"
	@echo "4.  git push -u origin HEAD   # topic only"
	@echo "5.  gh pr create --base develop"
	@echo "6.  CI green → merge PR → delete topic branch"
	@echo "7.  git checkout develop && git pull --ff-only"
	@echo ""
	@echo "    STOP unless user asked to ship / release."
	@echo ""
	@echo "    VERSION bump = solo PR chore/release-X.Y.Z → develop"
	@echo ""
	@echo "8.  gh pr create --base main --head develop   # user OK"
	@echo "9.  CI green → merge"
	@echo "10. checkout main, pull --ff-only"
	@echo "11. git tag -a $(TAG) -m \"Release $(VERSION)\" && git push origin $(TAG)"
	@echo "12. back to develop; PR main→develop if histories diverged"
