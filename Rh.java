import org.mozilla.javascript.Context;
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

            // Class c = cx.getClass();

          //   Method[] m = c.getDeclaredMethods();
          // for(int i = 0; i < m.length; i++) {
          //    System.out.println("method = " + m[i].toString());
          // }
          // System.out.println(cx.toString());


            Scriptable scope = cx.initStandardObjects();
            // val wrapper = Wrapper(Map("date" -> testDate),cx, scope)

            ScriptableObject.putProperty(scope, "aaa", 123);
            Object ob = cx.evaluateString(scope, code, "rhinodemojs", 1, null);
            System.out.println(Context.toObject(ob, scope));
        }
        catch(Exception e) {
            e.printStackTrace();
        }
    }
}