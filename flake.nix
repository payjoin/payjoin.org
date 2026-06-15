{
  description = "Payjoin Integration Tracker — MkDocs Material site (nix dev/host)";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAll = f: nixpkgs.lib.genAttrs systems (s: f nixpkgs.legacyPackages.${s});
      # Everything main.py / mkdocs.yml need: material theme, macros plugin
      # (main.py is the macros module), pymdownx extensions, pyyaml for the data.
      pyEnv = pkgs: pkgs.python3.withPackages (ps: with ps; [
        mkdocs
        mkdocs-material
        mkdocs-macros-plugin
        pymdown-extensions
        pyyaml
      ]);
    in
    {
      devShells = forAll (pkgs: {
        default = pkgs.mkShell {
          packages = [ (pyEnv pkgs) ];
          shellHook = ''
            echo "mkdocs ready — host with: mkdocs serve -a 127.0.0.1:8000"
          '';
        };
      });

      # `nix run .#serve` → temporary local host; `nix run .#build` → static ./site
      apps = forAll (pkgs: {
        serve = {
          type = "app";
          program = toString (pkgs.writeShellScript "tracker-serve" ''
            exec ${pyEnv pkgs}/bin/mkdocs serve -a 127.0.0.1:8000
          '');
        };
        build = {
          type = "app";
          program = toString (pkgs.writeShellScript "tracker-build" ''
            exec ${pyEnv pkgs}/bin/mkdocs build --strict
          '');
        };
      });
    };
}
