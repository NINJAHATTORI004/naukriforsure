import os
import re
import shutil

# First, define known mappings from file names to target paths based on our analysis
known_paths = {
    'main.ts': 'src/main.ts',
    'app.module.ts': 'src/app.module.ts',
    'infrastructure.module.ts': 'src/infrastructure/infrastructure.module.ts',
    'prisma.module.ts': 'src/infrastructure/prisma/prisma.module.ts',
    'bullmq.module.ts': 'src/infrastructure/bullmq/bullmq.module.ts',
    'opensearch.module.ts': 'src/infrastructure/opensearch/opensearch.module.ts',
    'health.module.ts': 'src/infrastructure/health/health.module.ts',
    's3.module.ts': 'src/infrastructure/s3/s3.module.ts',
    'iam.module.ts': 'src/modules/iam/iam.module.ts',
    'users.module.ts': 'src/modules/users/users.module.ts',
    'candidate.module.ts': 'src/modules/candidate/candidate.module.ts',
    'resume.module.ts': 'src/modules/resume/resume.module.ts',
    'shared.module.ts': 'src/shared/shared.module.ts',
}

base_dir = '.'
all_files = [f for f in os.listdir('.') if os.path.isfile(f) and (f.endswith('.ts') or f.endswith('.js'))]

resolved_paths = dict(known_paths)

def resolve_imports():
    changed = True
    while changed:
        changed = False
        for k, v in list(resolved_paths.items()):
            if k not in all_files: continue
            with open(k, 'r', encoding='utf-8') as f:
                 content = f.read()
            current_dir = os.path.dirname(v)
            imports = re.findall(r'from\s+[\'"](\.[^\'"]+)[\'"]', content)
            for imp in imports:
                norm_path = os.path.normpath(os.path.join(current_dir, imp)).replace('\\', '/')
                target_base = os.path.basename(imp)
                
                for ext in ['.ts', '.js']:
                    target_name = target_base + ext
                    if target_name in all_files and target_name not in resolved_paths:
                        resolved_paths[target_name] = norm_path + ext
                        changed = True

resolve_imports()

# Let's print out what we've resolved
for k, v in resolved_paths.items():
    print(f"{k} -> {v}")

# Now list what is NOT resolved
unresolved = set(all_files) - set(resolved_paths.keys())
print("\nUnresolved files:")
for f in unresolved:
    print(f)

# If we are confident, we can move the files
if len(unresolved) < 10: # Let's say if mostly resolved
    for f, p in resolved_paths.items():
        if os.path.exists(f):
            os.makedirs(os.path.dirname(p), exist_ok=True)
            shutil.move(f, p)
            print(f"Moved {f} to {p}")
