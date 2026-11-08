# Offline translation proxy for the Information Library.
#
# amd64 only, and this is not just packaging: Bergamot's intgemm backend is
# x86 specific and there is no aarch64 wheel. ARM would need marian's `ruy`
# path. The build workflow pins linux/amd64 so this fails loudly at build time
# rather than pulling cleanly on ARM and dying at start.
FROM python:3.10.22-slim-trixie

# Pinned to python 3.10 because that is what bergamot 0.4.5 publishes wheels
# for. On 3.12 pip resolves no further than 0.1.2 and the build fails outright.
# Moving off this pin means moving off the wheel, see below.
#
# bergamot 0.4.5 is the PyPI wheel, uploaded 2022-06-21. It works, and it is
# what the spike proved, but it is old: browsermt/bergamot-translator's last
# real commit was 2024-05 and the maintained successor is mozilla/translations
# (inference/). Moving to a build from that repo is tracked as follow-up work
# and would remove this pin.
#
# Python 3.10 is past upstream EOL (2026-10), so 3.10.22 is the last release.
# The pip/setuptools the base image ships carry known CVEs (pip-audit), so they
# are upgraded here, and bergamot's unpinned transitive deps are pinned to the
# versions pip-audit reported clean. Bump them together.
RUN pip install --no-cache-dir --upgrade pip==26.3 setuptools==84.2.1 \
 && pip install --no-cache-dir \
      bergamot==0.4.5 \
      requests==2.34.2 urllib3==2.8.0 certifi==2026.10.23 idna==3.20 \
      charset-normalizer==3.5.2 PyYAML==6.0.3 appdirs==1.4.4

WORKDIR /app
COPY blocks.py proxy.py fetch_models.py entrypoint.sh /app/
RUN chmod +x /app/entrypoint.sh

# Models are a mounted volume, not baked in: at ~37 MB per direction the image
# would balloon, and which languages a user wants is not knowable at build time.
ENV MODELS=/models \
    KIWIX=http://nomad_kiwix_server:8080 \
    PORT=8391 \
    WORKERS=8 \
    TRANSLATE_LANGS=fr,es,de

EXPOSE 8391

HEALTHCHECK --interval=30s --timeout=5s --start-period=120s --retries=3 \
  CMD python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://localhost:8391/viewer', timeout=4).status==200 else 1)"

ENTRYPOINT ["/app/entrypoint.sh"]
