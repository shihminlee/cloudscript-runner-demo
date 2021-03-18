import java.io.*;
import org.mozilla.javascript.*;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.tools.shell.Global;
import java.util.concurrent.*;
import java.lang.reflect.*;
import javax.script.*;
import java.io.File;  // Import the File class
import java.io.FileNotFoundException;  // Import this class to handle errors
import java.util.Scanner; // Import the Scanner class to read text files

public class Rh {
    static String getCode(String filename) {
        try {
            File obj = new File(filename);
            Scanner reader = new Scanner(obj);
            StringBuilder s = new StringBuilder();
            while (reader.hasNextLine()) {
                String data = reader.nextLine();
                s.append(data);
                s.append(";");
            }
            return s.toString();
        } catch (FileNotFoundException e) {
            return "";
        }
    }

    public static void main(String[] args) {
        String code = getCode("/Users/shih-min.lee/Desktop/stop-example/scripts/for-java.js");

        try {
            // Global global = new Global(cx);
            Context cx = Context.enter();
            A a = new A();
            a.hello();
            a.hello();
            a.hello();
            a.hello();
            Object[] functionParams = new Object[] {a};
            cx.setOptimizationLevel(-1);

            // Otherclass ac = new Otherclass();

            Class c = cx.getClass();

          //   Method[] m = c.getDeclaredMethods();
          // for(int i = 0; i < m.length; i++) {
          //    System.out.println("method = " + m[i].toString());
          // }
          // System.out.println(cx.toString());


            Scriptable scope = cx.initStandardObjects();
            // // val wrapper = Wrapper(Map("date" -> testDate),cx, scope)

            // A cc = new A();
            // cc.hello();
            // // NativeJavaClass rType = new NativeJavaClass(scope, A);
            // // scope.put("rType", scope, rType);

            ScriptableObject.putProperty(scope, "aaa", 123);
            // ScriptableObject.putProperty(scope, "c",  cc);
            // String[] cars = {"Volvo", "BMW", "Ford", "Mazda"};
            // ScriptableObject.putProperty(scope, "cars", cars);
            // Object ob = cx.evaluateString(scope, code, "rhinodemojs", 1, null);
            // System.out.println(Context.toObject(ob, scope));

            cx.evaluateString(scope, code, "ScriptAPI", 1, null);
            Function function = (Function) scope.get("jsFunction", scope);
            Object jsResult = function.call(cx,scope,scope,functionParams);
            String result = Context.toString(jsResult);

            System.out.println(result);

        }
        catch(Exception e) {
            e.printStackTrace();
        }
    }
}

public class A {
    public void hello() {
        System.out.println("world");
    }
}