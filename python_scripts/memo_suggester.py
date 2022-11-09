import ast
import ast_manipulation
import inspect
from collections import defaultdict
import json
import importlib

func_calls = defaultdict(lambda: 0)

def func_call_info(func, locals, caller_frame_info):
    args = []
    for key in locals:
        args.append("{}={}".format(key, locals[key]))

    func_calls["{}({})@line {}".format(func.__name__, ", ".join(args), caller_frame_info.lineno)] += 1

if __name__ == "__main__":
    module_to_analyse = importlib.import_module("recursive_functions")
    source_code = inspect.getsource(module_to_analyse)

    tree = ast.parse(source_code)
    ast_manipulation.ModuleImporter().visit(tree)
    ast_manipulation.FunctionInserter().visit(tree)

    exec(compile(tree, filename='<ast>', mode='exec'))

    print(json.dumps(func_calls, indent=4))

    with open('./func_calls.json', 'w') as f:
        json.dump(func_calls, f, indent=4)